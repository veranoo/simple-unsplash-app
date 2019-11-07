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
  const [hasMore, setHasMore] = useState(false);
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
        setHasMore(true);
        setPhotos(response);
      })
      .catch(() => {
        setHasMore(false);
        setError(true);
        setPhotos([]);
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
        if (!response.length) {
          setHasMore(false);
          return;
        }
        setPhotos(photos => [...photos, ...response]);
      })
      .catch(() => {
        setError(true);
        setHasMore(false);
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
          loadMore={loadMore}
          hasMore={hasMore}
          loader={<div key='loading'>Loading..</div>}
        >
          <ImagesWrapper ref={ref} key={0}>
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
        {error && <div>Wystąpił błąd</div>}
      </Container>
    </Layout>
  );
};
