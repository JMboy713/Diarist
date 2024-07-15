import React from 'react';
import styled from 'styled-components/native';
import {TouchableOpacity, Text} from 'react-native';
import Splash from '../assets/splash.png';
import Google from '../assets/googleicon.png';
import Kakao from '../assets/kakaoicon.png';

const Container = styled.View`
  flex: 1;
  justify-content: center;
  align-items: center;
  background-color: #ffffff;
`;

const StyledText = styled.Text`
  color: #000;
  text-align: center;
  font-size: ${props => 42 * props.theme.widthRatio}px;
  font-family: 'Pretendard-Regular';
  font-weight: 500;
  line-height: normal;
  letter-spacing: ${props => -0.63 * props.theme.widthRatio}px;
`;

const LogoIcon = styled.Image`
  width: ${props => 600 * props.theme.widthRatio}px;
  height: ${props => 500 * props.theme.widthRatio}px;
`;

const KakaoIcon = styled.Image`
  width: ${props => 30 * props.theme.widthRatio}px;
  height: ${props => 27 * props.theme.widthRatio}px;
  aspect-ratio: 1.1;
  position: absolute;
  left: 10px;
`;

const GoogleIcon = styled.Image`
  width: ${props => 30 * props.theme.widthRatio}px;
  height: ${props => 30 * props.theme.widthRatio}px;
  position: absolute;
  left: 10px;
`;

const GoogleButton = styled(TouchableOpacity)`
  position: relative;
  width: ${props => 580 * props.theme.widthRatio}px;
  height: ${props => 80 * props.theme.widthRatio}px;
  border-radius: 15px;
  border: 1px solid #333;
  justify-content: center;
  align-items: center;
  margin-top: 20px;
  flex-direction: row;
`;

const KakaoButton = styled(TouchableOpacity)`
  width: ${props => 580 * props.theme.widthRatio}px;
  height: ${props => 80 * props.theme.widthRatio}px;
  flex-shrink: 0;
  border-radius: 15px;
  background-color: #eedb54;
  justify-content: center;
  align-items: center;
  flex-direction: row;
`;

const ButtonText = styled(Text)`
  color: #0f0f0f;
  font-size: ${props => 24 * props.theme.widthRatio}px;
  font-family: 'Pretendard-Regular';
  font-weight: 500;
  line-height: normal;
`;

function Login() {
  return (
    <Container>
      <StyledText>나의 하루를</StyledText>
      <StyledText>피카소가 그려준다면?</StyledText>
      <LogoIcon source={Splash} />
      <KakaoButton>
        <KakaoIcon source={Kakao} />
        <ButtonText>Kakao 로그인</ButtonText>
      </KakaoButton>
      <GoogleButton>
        <GoogleIcon source={Google} />
        <ButtonText>Google 로그인</ButtonText>
      </GoogleButton>
    </Container>
  );
}

export default Login;