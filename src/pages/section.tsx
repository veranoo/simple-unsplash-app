import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useUnsplahApi } from '../components/app';
import InfiniteScroll from 'react-infinite-scroller';

import styled from 'styled-components';
import { PhotoImage } from '../components/photo-image';
import { Layout } from '../components/layout';
import Container from '../components/container';

const ImagesWrapper = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const ImageWrapper = styled.div`
  width: 22%;
  margin: 10px 0;
  position: relative;
`;

const SelectWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 50px;
  align-items: center;
`;

export const Section: React.FC<RouteComponentProps<any>> = props => {
  const unsplashApi = useUnsplahApi();
  const params = useRef({
    page: 1,
    perPage: 10
  });
  const [photos, setPhotos] = useState([]);
  const [orderBy, setOrderBy] = useState('latest');
  const [error, setError] = useState(false);
  const ref = useRef();

  useEffect(() => {
    unsplashApi
      .getCollectionPhotos(
        props.match.params.id,
        params.current.page,
        params.current.perPage,
        orderBy
      )
      .then(response => {
        setPhotos(response);
      })
      .catch(() => {
        setError(true);
      });
  }, [orderBy]);

  const loadMore = useCallback(() => {
    params.current = {
      ...params.current,
      page: params.current.page + 1
    };

    unsplashApi
      .getCollectionPhotos(
        props.match.params.id,
        params.current.page,
        params.current.perPage,
        orderBy
      )
      .then(response => {
        setPhotos(photos => [...photos, ...response]);
      })
      .catch(() => {
        setError(true);
      });
  }, [orderBy]);

  const handleChangeOrder = useCallback(evt => {
    setOrderBy(evt.target.value);
  }, []);

  return (
    <Layout>
      <SelectWrapper>
        <select onChange={handleChangeOrder}>
          <option value='latest'>Najnowsze</option>
          <option value='popular'>Popularne</option>
        </select>
      </SelectWrapper>
      <Container>
        <InfiniteScroll
          pageStart={0}
          loadMore={loadMore}
          hasMore={true}
          loader={
            error ? (
              <div>Wystąpił błąd</div>
            ) : (
              <div className='loader' key={0}>
                Loading ...
              </div>
            )
          }
        >
          <ImagesWrapper ref={ref}>
            {photos.map(item => {
              return (
                <ImageWrapper key={item.id}>
                  <Link to={`/photo/${item.id}`}>
                    <PhotoImage id={item.id} src={item.urls.small} alt='' />
                  </Link>
                </ImageWrapper>
              );
            })}
          </ImagesWrapper>
        </InfiniteScroll>
      </Container>
    </Layout>
  );
};
