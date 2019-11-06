import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';

const LazyImage = ({ src, alt = '' }) => {
  const [ref, inView] = useInView({
    threshold: 0
  });
  const [loading, setLoading] = useState(true);
  const [lazySrc, setLazySrc] = useState('');

  useEffect(() => {
    if (inView) {
      setLazySrc(src);
    }
  }, [inView, src]);

  const handleLoad = () => {
    setLoading(false);
  };

  return (
    <div ref={ref} style={{ display: 'inline-block' }}>
      {loading && <div>Loader</div>}
      <img onLoad={handleLoad} src={lazySrc} alt={alt} />
    </div>
  );
};

export default LazyImage;
