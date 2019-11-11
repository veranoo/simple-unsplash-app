import { render, wait, fireEvent } from '@testing-library/react';
import { UnsplashContext } from '../../providers/unsplash-provider';
import React from 'react';
import collections from '../../../mocks/collections.json';
import photos from '../../../mocks/photos.json';
import { Section } from '../section';
import { BrowserRouter } from 'react-router-dom';
import { mockAllIsIntersecting } from 'react-intersection-observer/test-utils';

test('should render Section page when success', async () => {
  const mock = {
    listCollections: () => Promise.resolve(collections),
    getPhoto: () => Promise.resolve(null),
    getCollectionPhotos: () => Promise.resolve(photos)
  };
  const MockProvider = ({ children }) => (
    <UnsplashContext.Provider value={mock as any}>{children}</UnsplashContext.Provider>
  );

  jest.spyOn(mock, 'getCollectionPhotos').mockImplementationOnce(() => {
    return Promise.resolve(photos);
  });

  mockAllIsIntersecting(true);

  const { baseElement, getAllByRole, debug,  } = render(
    <BrowserRouter>
      <MockProvider>
        <Section
          history={null as any}
          location={null as any}
          match={{ params: { id: 0 } } as any}
        />
      </MockProvider>
    </BrowserRouter>
  );

  await wait();
  mockAllIsIntersecting(true);
  await wait();
  expect(mock.getCollectionPhotos).toBeCalled();
  debug();
});
