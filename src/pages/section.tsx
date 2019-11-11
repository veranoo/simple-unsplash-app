import React, { memo, useCallback, useEffect, useReducer, useRef } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import InfiniteScroll from 'react-infinite-scroller';

import styled from 'styled-components';
import { PhotoImage } from '../components/photo-image';
import { Layout } from '../components/layout';
import Container from '../components/container';
import {
  sectionReducer,
  SET_ERROR,
  SET_LOAD_MORE,
  SET_LOAD_MORE_ERROR,
  SET_NOT_LOAD_MORE,
  SET_PHOTOS
} from '../reducers/section-reducer';
import { useUnsplashApi } from '../hooks/use-unsplash-api';

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

interface PhotoItemProps {
  id: number;
  urls: {
    small: string;
  };
  alt?: string;
}

const PhotoItem = memo<PhotoItemProps>(({ id, urls, alt }) => {
  return (
    <ImageWrapper key={id} className='image'>
      <Link to={`/photo/${id}`}>
        <PhotoImage id={id} src={urls.small} alt={alt} />
      </Link>
    </ImageWrapper>
  );
});

const INITIAL_PAGE = 1;
const PHOTOS_PER_PAGE = 10;
const INITIAL_ORDER_BY = 'latest';

export const Section: React.FC<RouteComponentProps<{ id: string }>> = props => {
  const unsplashApi = useUnsplashApi();
  const params = useRef({
    page: INITIAL_PAGE,
    perPage: PHOTOS_PER_PAGE,
    orderBy: INITIAL_ORDER_BY
  });

  const ref = useRef();

  const [state, dispatch] = useReducer(sectionReducer, {
    photos: [],
    hasMore: false,
    error: false
  });

  const fetchCollections = useCallback(() => {
    unsplashApi
      .getCollectionPhotos(
        Number(props.match.params.id),
        params.current.page,
        params.current.perPage,
        params.current.orderBy
      )
      .then(response => {
        dispatch({ type: SET_PHOTOS, payload: { photos: response } });
      })
      .catch(() => {
        if (!ref.current) {
          return;
        }
        dispatch({ type: SET_ERROR });
      });
  }, []);

  useEffect(() => {
    fetchCollections();

    return () => {
      unsplashApi.abort();
    }
  }, []);

  const loadMore = useCallback(() => {
    params.current.page += 1;

    unsplashApi
      .getCollectionPhotos(
        Number(props.match.params.id),
        params.current.page,
        params.current.perPage,
        params.current.orderBy
      )
      .then(response => {
        if (!response.length) {
          dispatch({ type: SET_NOT_LOAD_MORE });
          return;
        }

        dispatch({ type: SET_LOAD_MORE, payload: { photos: response } });
      })
      .catch(() => {
        if (!ref.current) {
          return;
        }
        dispatch({ type: SET_LOAD_MORE_ERROR });
      });
  }, []);

  const handleChangeOrder = useCallback(evt => {
    params.current.orderBy = evt.target.value;
    fetchCollections();
  }, []);

  const items = (
    <ImagesWrapper>
      {state.photos.map(item => (
        <PhotoItem key={item.id} id={item.id} urls={item.urls} />
      ))}
    </ImagesWrapper>
  );

  return (
    <Layout>
      <SelectWrapper ref={ref}>
        <select onChange={handleChangeOrder}>
          <option value='latest'>Najnowsze</option>
          <option value='popular'>Popularne</option>
        </select>
      </SelectWrapper>
      <Container>
        <InfiniteScroll
          loadMore={loadMore}
          hasMore={state.hasMore}
          loader={<div key='loading'>Loading..</div>}
        >
          {items}
        </InfiniteScroll>
        {state.error && <div key='error'>Wystąpił błąd</div>}
      </Container>
    </Layout>
  );
};
