import styled from 'styled-components';
import { useUnsplahApi } from './app';
import { useInView } from 'react-intersection-observer';
import React, { useEffect, useState } from 'react';
import LazyImage from './lazy-image';

const BorderImageWrapper = styled.div`
  padding: 5px;
  border: solid 1px #ccc;
  position: relative;
`;

const ImageWrapper = styled.div`
  flex-grow: 0;
  flex-shrink: 0;
  flex-basis: 8%;
  box-sizing: border-box;
  margin: 10px 0;
`;

const PhotosWrapper = styled.div`
  display: flex;
  overflow: auto;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Wrapper = styled.div`
  display: flex;
  height: 100%;
  align-items: center;
  flex-direction: column;
  min-height: 200px;
  justify-content: center;
`

const SectionItemPhotos = ({
  id,
  orderBy = 'latest',
  perPage = 10,
  page = 1
}) => {
  const unsplahApi = useUnsplahApi();
  const [ref, inView] = useInView({
    threshold: 0
  });

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [photos, setPhotos] = useState([]);

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
      })
      .catch(() => {
        setError(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [visible]);

  return (
    <Wrapper ref={ref}>
      {loading && <div>Trwa ładowanie...</div>}
      {error && <div>Wystąpił błąd</div>}
      <PhotosWrapper>
        {photos.map(item => (
          <ImageWrapper key={item.id}>
            <BorderImageWrapper>
              <LazyImage src={item.urls.small} alt='' />
            </BorderImageWrapper>
          </ImageWrapper>
        ))}
      </PhotosWrapper>
    </Wrapper>
  );
};

export default SectionItemPhotos;
