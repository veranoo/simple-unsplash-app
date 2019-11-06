import React, { useEffect, useState } from 'react';
import { useUnsplahApi } from '../components/app';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import Image from '../components/image';

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
    <div ref={ref}>
      {loading && <div>Trwa ładowanie...</div>}
      {error && <div>Wystąpił błąd</div>}
      {photos.map(item => (
        <Image key={item.id} src={item.urls.small} alt='' />
      ))}
    </div>
  );
};

export const Sections = () => {
  const unsplahApi = useUnsplahApi();

  const [collections, setCollections] = useState([]);

  useEffect(() => {
    console.log(unsplahApi);
    unsplahApi.listCollections().then(response => {
      console.log(response);
      setCollections(
        response.map(item => {
          return {
            id: item.id,
            preview_photos: item.preview_photos,
            title: item.title
          };
        })
      );
    });
  }, []);

  return (
    <div>
      {collections.map(item => (
        <div key={item.id} style={{ minHeight: '300px', padding: '20px' }}>
          <Link to={`/section/${item.id}`}>
            <div>{item.title}</div>
          </Link>
          <SectionItemPhotos id={item.id} orderBy='latest' />
        </div>
      ))}
    </div>
  );
};
