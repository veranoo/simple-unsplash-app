import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import LazyImage from '../components/lazy-image';
import { Layout } from '../components/layout';
import styled from 'styled-components';
import Container from '../components/container';
import { useUnsplashApi } from '../hooks/use-unsplash-api';

const Wrapper = styled.div`
  display: flex;
  margin: 10px 0;
`;

const Column = styled.div`
  width: 50%;
  padding: 0 10px;
`;

const Button = styled.button`
  padding: 10px;
  margin: 10px 0;
  background: #2b71ff;
  color: #fff;
`;

export const Photo: React.FC<RouteComponentProps<{ id: string }>> = props => {
  const unsplashApi = useUnsplashApi();
  const [photo, setPhoto] = useState(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    unsplashApi
      .getPhoto(props.match.params.id)
      .then(response => {
        setPhoto(response);
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  const handleClickShare = () => {
    window['FB'].ui({
      method: 'share',
      href: photo.links.html
    });
  };

  return (
    <Layout>
      <Container>
        {photo && (
          <Wrapper>
            <Column>
              <LazyImage src={photo.urls.regular} alt={photo.alt_description} />
            </Column>
            <Column>
              {photo.description && <div>Opis: {photo.description}</div>}
              {photo.likes && <div>Ilość polubień: {photo.likes}</div>}
              {(photo.exif.make || photo.exif.model) && (
                <div>
                  Model aparatu: {photo.exif.make} {photo.exif.model}
                </div>
              )}
              <Button onClick={handleClickShare}>Udostępnij na facebooku</Button>
            </Column>
          </Wrapper>
        )}
        {error && <div>Wyśtąpił błąd</div>}
      </Container>
    </Layout>
  );
};
