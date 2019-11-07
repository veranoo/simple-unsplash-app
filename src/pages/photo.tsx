import React, { useEffect, useState } from 'react';
import { RouteComponentProps } from 'react-router';
import { useUnsplahApi } from '../components/app';
import LazyImage from '../components/lazy-image';
import { Layout } from '../components/layout';
import styled from 'styled-components';
import Container from '../components/container';

const Wrapper = styled.div`
  display: flex;
`;

const Column = styled.div`
  width: 50%;
`;

export const Photo: React.FC<RouteComponentProps<any>> = props => {
  const unsplashApi = useUnsplahApi();
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

  return (
    <Layout>
      <Container>
        <Wrapper>
          {photo && (
            <Column>
              <LazyImage src={photo.urls.regular} alt={photo.alt_description} />
            </Column>
          )}
          {photo && (
            <Column>
              <div>{photo.name}</div>
            </Column>
          )}
        </Wrapper>
        {error && <div>Wyśtąpił błąd</div>}
      </Container>
    </Layout>
  );
};
