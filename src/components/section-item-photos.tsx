import styled from 'styled-components';
import { useInView } from 'react-intersection-observer';
import React, { memo, useCallback, useEffect, useRef, useState } from 'react';
import LazyImage from './lazy-image';
import { useUnsplashApi } from '../hooks/use-unsplash-api';
import { Urls } from '../providers/unsplash-provider';

const BorderImageWrapper = styled.div`
  padding: 5px;
  border: solid 1px #ccc;
  position: relative;
`;

const ImageWrapper = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 19%;
  box-sizing: border-box;
  margin: 10px 0;
`;

const PhotosWrapper = styled.div`
  display: flex;
  overflow: auto;
  flex-wrap: wrap;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  flex-direction: column;
  min-height: 200px;
  justify-content: center;
`;

interface ItemProps {
  urls: Urls;
}

const Item = memo<ItemProps>(({ urls }) => (
  <ImageWrapper>
    <BorderImageWrapper>
      <LazyImage src={urls.small} alt='' />
    </BorderImageWrapper>
  </ImageWrapper>
));

const SectionItemPhotos = ({
  id,
  orderBy = 'latest',
  perPage = 10,
  page = 1
}) => {
  const unsplahApi = useUnsplashApi();
  const [ref, inView] = useInView({
    threshold: 0,
    triggerOnce: true
  });

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [photos, setPhotos] = useState([]);
  const domRef = useRef<any>();

  useEffect(() => {
    if (inView) {
      setVisible(true);
    }
  }, [inView]);

  useEffect(() => {
    if (!visible) {
      return;
    }

    unsplahApi
      .getCollectionPhotos(id, page, perPage, orderBy)
      .then(response => {
        setPhotos(response);
        setError(false);
        setLoading(false);
      })
      .catch(() => {
        if (!domRef.current) {
          return;
        }
        setError(true);
        setLoading(false);
      });

    return () => {
      unsplahApi.abort();
    };
  }, [visible]);

  const refDom = useCallback(dom => {
    ref(dom);
    domRef.current = dom;
  }, []);

  return (
    <Wrapper ref={refDom}>
      {loading && <div>Trwa ładowanie...</div>}
      {error && <div>Wystąpił błąd</div>}
      <PhotosWrapper>
        {photos.map(item => (
          <Item key={item.id} urls={item.urls} />
        ))}
      </PhotosWrapper>
    </Wrapper>
  );
};

export default SectionItemPhotos;
