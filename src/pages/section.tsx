import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { useUnsplahApi } from '../components/app';
import InfiniteScroll from 'react-infinite-scroller';

import Masonry from 'react-masonry-component';
import LazyImage from '../components/image';

const Gallery: React.FC = ({ children }) => (
  <Masonry
    className={'my-gallery-class'} // default ''
    elementType={'ul'} // default 'div'
    disableImagesLoaded={false} // default false
    updateOnEachImageLoad={false} // default false and works only if disableImagesLoaded is false
  >
    {children}
  </Masonry>
);

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
      });
  }, [orderBy]);

  const handleChangeOrder = useCallback(evt => {
    setOrderBy(evt.target.value);
  }, []);

  return (
    <div>
      <select onChange={handleChangeOrder}>
        <option value='latest'>Najnowsze</option>
        <option value='popular'>Popularne</option>
      </select>
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
        <div ref={ref}>
          <Gallery>
            {photos.map(item => {
              return (
                <Link to={`/photo/${item.id}`} key={item.id}>
                  <div style={{ padding: 20 }}>
                    <LazyImage src={item.urls.small} alt='' />
                  </div>
                </Link>
              );
            })}
          </Gallery>
        </div>
      </InfiniteScroll>
    </div>
  );
};
