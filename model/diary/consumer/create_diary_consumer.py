import json
import os
import sys
from datetime import datetime

import django
from confluent_kafka import Consumer, KafkaError, Producer
from openai import OpenAI

sys.path.append('/app/')

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from django.conf import settings
from diary.models import Diary, User, Emotion, Image, Artist
from diary.utils import S3ImgUploader


KAFKA_BROKER_URL = settings.KAFKA_BROKER_URL
CREATE_DIARY_TOPIC = settings.KAFKA_TOPIC_CREATE
RESPONSE_DIARY_TOPIC = settings.KAFKA_TOPIC_RESPONSE
GROUP_ID = settings.KAFKA_CREATE_GROUP
OPENAI_API_KEY = settings.OPENAI_API_KEY

client = OpenAI(api_key=OPENAI_API_KEY)


def generate_description(diary_text, artist_style, emotion):
    query = f"{diary_text}라는 내용을 {artist_style}의 화풍으로 그려줘. 감정은 {emotion}이야."
    response = client.chat.completions.create(
        model="gpt-3.5-turbo",
        messages=[
            {"role": "system", "content": "Create an art diary entry response reflecting a specific artist's style without naming the artist."},
            {"role": "system", "content": "Describe the scene you want to illustrate. Mention key characteristics of the style like impressionistic, vibrant colors, or soft lighting."},
            {"role": "user", "content": query}
        ],
    )
    return response.choices[0].message.content


def generate_image(description):
    response = client.images.generate(
        model="dall-e-3",
        prompt=description,
        size="1024x1024",
        quality="standard",
        n=1
    )
    return response.data[0].url


def send_response(user_id, diary_id):
    producer = Producer({'bootstrap.servers': KAFKA_BROKER_URL})
    response_message = json.dumps({"diary_id": diary_id, "user_id": user_id})
    producer.produce(RESPONSE_DIARY_TOPIC, key=str(diary_id), value=response_message)
    producer.flush()


def process_message(message):
    try:
        data = json.loads(message.value().decode('utf-8'))
        print(f"Received message: {data}")

        user_id = data['user_id']
        emotion_id = data['emotion_id']
        artist_id = data['artist_id']
        diary_date = datetime.strptime(data['diary_date'], '%Y-%m-%d')
        content = data['content']

        artist = Artist.objects.get(artist_id=artist_id)
        emotion = Emotion.objects.get(emotion_id=emotion_id)

        description = generate_description(content, artist.artist_name, emotion.emotion_name)
        image_url = generate_image(description)

        print(f"Generated image URL: {image_url}")
    
        s3_url = S3ImgUploader.upload_from_url(image_url)

        if not s3_url:
            raise Exception("Failed to upload image to S3")

        image = Image.objects.create(image_url=s3_url)

        user = User.objects.get(user_id=user_id)

        new_diary = Diary(
            user=user,
            diary_date=diary_date,
            content=content,
            emotion=emotion,
            artist=artist,
            image=image
        )
        new_diary.save()

        send_response(user_id, new_diary.diary_id)
    
    except Diary.DoesNotExist:
        return f"Diary for user {user_id} on {diary_date} does not exist."
    except User.DoesNotExist:
        return f"User with id {user_id} does not exist."
    except Artist.DoesNotExist:
        return f"Artist with id {artist_id} does not exist."
    except Emotion.DoesNotExist:
        return f"Emotion with id {emotion_id} does not exist."
    except KeyError as e:
        return f"Missing key in message: {e}"
    except json.JSONDecodeError as e:
        return f"Error decoding JSON: {e}"
    except Exception as e:
        return f"Error processing message: {e}"


def consume():
    consumer = Consumer({
        'bootstrap.servers': KAFKA_BROKER_URL,
        'group.id': GROUP_ID,
        'auto.offset.reset': 'earliest'
    })

    consumer.subscribe([CREATE_DIARY_TOPIC])

    while True:
        msg = consumer.poll(1.0)

        if msg is None:
            continue

        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            else:
                print(msg.error())
                break

        process_message(msg)

    consumer.close()


if __name__ == "__main__":
    consume()
