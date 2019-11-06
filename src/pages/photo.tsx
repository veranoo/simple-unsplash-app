import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useUnsplahApi } from '../components/app';
import LazyImage from '../components/image';

export const Photo: React.FC<RouteComponentProps<any>> = props => {
  const unsplashApi = useUnsplahApi();
  const [photo, setPhoto] = useState(null);

  useEffect(() => {
    unsplashApi.getPhoto(props.match.params.id).then(response => {
      setPhoto(response);
    });
  }, []);

  return (
    <div>
      {photo && <LazyImage src={photo.urls.regular} alt={photo.alt_description} />}
    </div>
  );
};
