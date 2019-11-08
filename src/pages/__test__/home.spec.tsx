import React from 'react';
import { render, wait } from '@testing-library/react';
import { Home } from '../home';
import { BrowserRouter } from 'react-router-dom';
import { UnsplashContext } from '../../providers/unsplash-provider';
import collections from '../../../mocks/collections.json';
import photos from '../../../mocks/photos.json';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils'

test('should render Home page when success', async () => {
  const MockProvider: React.FC = ({ children }) => {
    const value = {
      listCollections: () => Promise.resolve(collections),
      getPhoto: () => Promise.resolve(null),
      getCollectionPhotos: () => Promise.resolve(photos)
    };

    return (
      <UnsplashContext.Provider value={value}>
        {children}
      </UnsplashContext.Provider>
    );
  };

  const { container } = render(
    <BrowserRouter>
      <MockProvider>
        <Home />
      </MockProvider>
    </BrowserRouter>
  );
  mockAllIsIntersecting(true);
  await wait();
  mockAllIsIntersecting(true);
  await wait();
  mockAllIsIntersecting(true);
  await wait();
  expect(container).toMatchSnapshot();
});

test('should render Home page when error', async () => {
  const MockProvider: React.FC = ({ children }) => {
    const value = {
      listCollections: () => Promise.reject(null),
      getPhoto: () => Promise.resolve(null),
      getCollectionPhotos: () => Promise.reject(null)
    };

    return (
      <UnsplashContext.Provider value={value}>
        {children}
      </UnsplashContext.Provider>
    );
  };

  const { container } = render(
    <BrowserRouter>
      <MockProvider>
        <Home />
      </MockProvider>
    </BrowserRouter>
  );
  await wait();
  expect(container).toMatchSnapshot();
});
