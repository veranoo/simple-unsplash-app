import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import styled from 'styled-components';

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  min-height: 50px;
  align-items: center;
  justify-content: center;
`;

const options = {
  threshold: 0,
  triggerOnce: true
};

const LazyImage = ({ src, alt = '' }) => {
  const [ref, inView] = useInView(options);
  const [loading, setLoading] = useState(true);
  const [lazySrc, setLazySrc] = useState('');

  useEffect(() => {
    if (!lazySrc && inView) {
      setLazySrc(src);
    }
  }, [inView, src]);

  const handleLoad = useCallback(() => {
    setLoading(false);
  }, []);

  return (
    <Wrapper ref={ref}>
      <img
        style={{
          display: loading ? 'none' : 'block'
        }}
        width={'100%'}
        onLoad={handleLoad}
        src={lazySrc}
        alt={alt}
      />
    </Wrapper>
  );
};

export default memo(LazyImage);
