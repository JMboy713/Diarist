import React, {useEffect, useState} from 'react';
import styled from 'styled-components';
import useApi from '../hooks/useApi';
import TopNavBar from '../components/TopNavBar';
import CategoryButton from '../components/CategoryButton';
import BottomSheet from '../components/bottomsheet/BottomSheet';
import {useAuth} from '../context/AuthContext';

const Div = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
  margin-top: ${props => 40 * props.theme.widthRatio}px;
`;

const DrawerWrapper = styled.div`
  display: flex;
  height: calc(100vh - ${props => 350 * props.theme.widthRatio}px);
  flex-wrap: wrap;
  justify-content: space-evenly;
  align-items: center;
  box-sizing: border-box;
  column-gap: ${props => 30 * props.theme.widthRatio}px;
`;

const Figure = styled.figure`
  width: 45%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const Figcaption = styled.figcaption`
  text-align: center;
  font-size: ${props => 26 * props.theme.widthRatio}px;
  font-weight: 400;
  line-height: normal;
  margin-top: ${props => 5 * props.theme.widthRatio}px;
`;

const DrawerImg = styled.img`
  width: ${props => 250 * props.theme.widthRatio}px;
  height: auto;
`;

function SelectDrawerPage() {
  const [selectCategory, setSelectCategory] = useState('르네상스');
  const [selectDrawer, setSelectDrawer] = useState('');
  const [data, setData] = useState([]);

  const categoryArr = ['르네상스', '근대', '현대', '기타'];
  const [openModal, setOpenModal] = useState(false);
  const handleModal = item => {
    setSelectDrawer(item);
    setOpenModal(true);
  };
  const closeModal = () => {
    setOpenModal(false);
  };
  const categoryMap = {
    르네상스: 'RENAISSANCE',
    근대: 'MODERN',
    현대: 'CONTEMPORARY',
    기타: 'ANIMATION',
  };

  const {AxiosApi} = useApi();
  const {checkTokenExpiration} = useAuth();
  const fetchData = async category => {
    const token = await checkTokenExpiration();
    console.log('화가 선택,', token);
    try {
      const response = await AxiosApi('get', `/api/v1/artist/select?period=${category}`);
      console.log('응답', response);
      setData(response.data);
    } catch (e) {
      console.log('에러', e);
    }
  };
  const handleCategory = e => {
    setSelectCategory(e.target.innerText);
    const englishCategory = categoryMap[e.target.innerText];
    if (e.target.innerText === '기타') {
      alert('현재 개발 중입니다.');
      return;
    }

    fetchData(englishCategory);
  };
  useEffect(() => {
    console.log(data);
  }, [data]);

  useEffect(() => {
    fetchData('RENAISSANCE');
  }, []);

  return (
    <>
      <TopNavBar
        page='화가선택 페이지'
        progress='3'
        title1='당산과 함께 작업할 '
        title2='화가를 선택해주세요'
      />
      <div>
        <Div className='flex justify-between'>
          {categoryArr.map(category => (
            <CategoryButton
              key={category}
              isActive={selectCategory === category}
              label={category}
              onClick={e => {
                handleCategory(e);
              }}
            />
          ))}
        </Div>
        <DrawerWrapper>
          {data.map(item => (
            <Figure key={item.artistName}>
              {/* eslint-disable-next-line jsx-a11y/alt-text */}
              <DrawerImg
                src={item.artistPicture}
                onClick={() => {
                  handleModal(item);
                }}
              />
              <Figcaption>{item.artistName}</Figcaption>
            </Figure>
          ))}
        </DrawerWrapper>
      </div>
      {openModal && <BottomSheet data={selectDrawer} isOpen={openModal} isClose={closeModal} />}
    </>
  );
}

export default SelectDrawerPage;
