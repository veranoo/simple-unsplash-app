import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import SectionItemPhotos from '../components/section-item-photos';
import { Layout } from '../components/layout';
import Container from '../components/container';
import { useUnsplashApi } from '../hooks/use-unsplash-api';

const SectionWrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  text-align: center;
`;

const Title = styled.div`
  background: black;
  display: flex;
  width: 100%;
  justify-content: center;

  a {
    color: #fff;
    padding: 20px 0;
    text-decoration: none;
  }
`;

export const Home = () => {
  const unsplahApi = useUnsplashApi();

  const [collections, setCollections] = useState([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    unsplahApi
      .listCollections()
      .then(response => {
        setCollections(
          response.map(item => {
            return {
              id: item.id,
              preview_photos: item.preview_photos,
              title: item.title
            };
          })
        );
      })
      .catch(() => {
        setError(true);
      });
  }, []);

  return (
    <Layout>
      {collections.map(item => (
        <SectionWrapper key={item.id}>
          <Title>
            <Link to={`/section/${item.id}`}>{item.title}</Link>
          </Title>
          <Container>
            <SectionItemPhotos id={item.id} orderBy='latest' />
          </Container>
        </SectionWrapper>
      ))}
      {error && <Container>Wystąpił błąd</Container>}
    </Layout>
  );
};
