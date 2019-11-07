import { useUnsplahApi } from './app';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import LazyImage from './lazy-image';

const Description = styled.div`
  position: absolute;
  display: flex;
  flex-direction: column;
  background: rgba(0, 0, 0, 0.7);
  color: #fff;
  align-items: center;
  justify-content: center;
  bottom: 0;
  left: 0;
  top: 0;
  opacity: 0;
  transition: all 0.3s ease;
  right: 0;
`;

const BorderImageWrapper = styled.div`
  padding: 10px;
  border: solid 1px #ccc;
  position: relative;

  :hover ${Description} {
    opacity: 1;
  }
`;

export const PhotoImage = ({ src, alt, id }) => {
  const unsplashApi = useUnsplahApi();
  const [downloads, setDownloads] = useState(null);
  const [location, setLocation] = useState(null);

  const handleMouseEnter = useCallback(() => {
    if (downloads) {
      return;
    }
    unsplashApi.getPhoto(id).then(response => {
      setDownloads(response.downloads);
      setLocation(response.location.city);
    });
  }, []);

  return (
    <BorderImageWrapper onMouseEnter={handleMouseEnter}>
      <LazyImage src={src} alt={alt} />
      <Description>
        {location && <div>Lokalizacja: {location}</div>}
        {downloads && <div>Ilość pobrań: {downloads}</div>}
      </Description>
    </BorderImageWrapper>
  );
};
