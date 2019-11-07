import React, {
  memo,
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState
} from 'react';
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

const PhotoItem = memo<any>(({ id, urls, alt }) => {
  console.log('PhotoItem:render' + id);
  return (
    <ImageWrapper key={id}>
      <Link to={`/photo/${id}`}>
        <PhotoImage id={id} src={urls.small} alt={alt} />
      </Link>
    </ImageWrapper>
  );
});

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_ERROR':
      return {
        ...state,
        hasMore: false,
        error: true,
        photos: []
      };

    case 'SET_PHOTOS':
      return {
        ...state,
        photos: action.payload.photos,
        hasMore: true
      };

    case 'SET_LOAD_MORE':
      return {
        ...state,
        photos: [...state.photos, ...action.payload.photos],
        hasMore: true
      };

    case 'SET_NOT_LOAD_MORE':
      return {
        ...state,
        hasMore: false
      };

    case 'SET_LOAD_MORE_ERROR':
      return {
        ...state,
        error: true,
        hasMore: false
      };
  }
};

export const Section: React.FC<RouteComponentProps<any>> = props => {
  const unsplashApi = useUnsplahApi();
  const params = useRef({
    page: 1,
    perPage: 10,
    orderBy: 'latest'
  });
  const ref = useRef();

  const [state, dispatch] = useReducer(reducer, {
    photos: [],
    hasMore: false,
    error: false
  });

  const fetchCollections = useCallback(() => {
    unsplashApi
      .getCollectionPhotos(
        props.match.params.id,
        params.current.page,
        params.current.perPage,
        params.current.orderBy
      )
      .then(response => {
        dispatch({ type: 'SET_PHOTOS', payload: { photos: response } });
      })
      .catch(() => {
        dispatch({ type: 'SET_ERROR' });
      });
  }, []);

  useEffect(() => {
    fetchCollections();
  }, []);

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
        params.current.orderBy
      )
      .then(response => {
        if (!response.length) {
          dispatch({ type: 'SET_NOT_LOAD_MORE' });
          return;
        }

        dispatch({ type: 'SET_LOAD_MORE', payload: { photos: response } });
      })
      .catch(() => {
        dispatch({ type: 'SET_LOAD_MORE_ERROR' });
      });
  }, []);

  const handleChangeOrder = useCallback(evt => {
    params.current.orderBy = evt.target.value;
    fetchCollections();
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
          hasMore={state.hasMore}
          loader={<div key='loading'>Loading..</div>}
        >
          <ImagesWrapper ref={ref} key={0}>
            {state.photos.map(item => {
              return <PhotoItem key={item.id} id={item.id} urls={item.urls} />;
            })}
          </ImagesWrapper>
        </InfiniteScroll>
        {state.error && <div key='error'>Wystąpił błąd</div>}
      </Container>
    </Layout>
  );
};
