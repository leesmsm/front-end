import React, { useEffect, useRef, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import styled from 'styled-components';
import Axios from '../api/axios';
import Footer from '../components/Footer';
import Post from '../components/post/Post';
import PostDetailContent from '../components/PostDetailContent';
import PostDetailImg from '../components/PostDetailImg';
import QUERY from '../constants/query';
import ROUTER from '../constants/router';
import useGetQuery from '../hooks/useGetQuery';
import { setMessenger } from '../redux/modules/messenger';
import Storage from '../utils/localStorage';

const axios = new Axios(QUERY.AXIOS_PATH.SEVER);

export default function Detail() {
  const [temperatureServer, setTemperatureServer] = useState(null);
  const { postId } = useParams();
  const scrollRef = useRef();
  const userName = Storage.getUserName();

  const {
    isLoading,
    isError,
    data: postDetail,
  } = useGetQuery(
    [QUERY.KEY.POSTS, { postId }],
    QUERY.AXIOS_PATH.SEVER,
    QUERY.AXIOS_PATH.DETAIL(postId),
    true
  );

  const {
    isLoading: isHotLoding,
    isError: isHotError,
    data: postHot,
  } = useGetQuery(
    [QUERY.KEY.POSTS],
    QUERY.AXIOS_PATH.SEVER,
    QUERY.AXIOS_PATH.MAIN_POST,
    true
  );

  useEffect(() => {
    if (postDetail && postHot) {
      scrollRef.current.scrollIntoView({
        block: 'start',
      });
    }
  }, [postId]);

  const handleLikeUp = () => {
    axios
      .post(`${QUERY.AXIOS_PATH.LIKE_POST}/${postId}`)
      .then(response => setTemperatureServer(response.data.result.temperature));
  };

  const handleLikeDown = () => {
    axios
      .post(`${QUERY.AXIOS_PATH.HATE_POST}/${postId}`)
      .then(response => setTemperatureServer(response.data.result.temperature));
  };

  return (
    <>
      {isLoading && isHotLoding && <p>로딩중</p>}
      {isError && isHotError && <p>에러</p>}
      {postDetail && postHot && (
        <DetailWrapper>
          <DetailContainer ref={scrollRef}>
            <PostDetailImg imageUrlList={postDetail.data.result.imageUrlList} />
            <PostDetailContent
              detail={postDetail.data.result}
              postId={postId}
              userName={userName}
              temperatureServer={temperatureServer}
              onLikeUp={handleLikeUp}
              onLikeDown={handleLikeDown}
            />
            <PostContainer>
              <Post posts={postHot} path={ROUTER.PATH.DETAIL} imgRegular={true}>
                <ContentContainer>
                  <Title>당근마켓 인기중고</Title>
                  <Link to={ROUTER.PATH.HOT_ARTICLES}>
                    <Linkto>더 구경하기</Linkto>
                  </Link>
                </ContentContainer>
              </Post>
            </PostContainer>
            <Footer />
          </DetailContainer>
        </DetailWrapper>
      )}
    </>
  );
}

const DetailWrapper = styled.section`
  width: 100%;
  height: 100%;
  overflow-y: auto;
  overflow-x: hidden;
`;

const DetailContainer = styled.section`
  width: 40rem;
  height: 100%;
  margin: 0 auto;
`;

const PostContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-around;
  width: 40rem;
  height: auto;
`;

const ContentContainer = styled.div`
  display: flex;
  justify-content: space-between;
  width: 100%;
  margin: 2rem 0;
`;

const Title = styled.div`
  font-size: ${props => props.theme.fontSize.large_regular};
  font-weight: ${props => props.theme.fontWeight.semi_bold};
`;

const Linkto = styled.div`
  color: ${props => props.theme.color.carrot_orange};
  font-size: ${props => props.theme.fontSize.regular};
`;
