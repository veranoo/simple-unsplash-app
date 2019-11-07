import React, { useContext, useMemo } from 'react';
import { Reset } from 'styled-reset';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Unsplash from 'unsplash-js';
import { Photo } from '../pages/photo';
import { Home } from '../pages/home';
import { Section } from '../pages/section';
import mockCollections from '../../mocks/collections.json';
import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    font-family: Arial,sans-serif ;
  }
`;

interface UnsplashProviderInterface {
  listCollections(): Promise<any[]>;
  getPhoto(photoId: string): Promise<any>;
  getCollectionPhotos(
    collectionId: number,
    page: number,
    perPage: number,
    orderBy: string
  ): Promise<any>;
}

const UnsplashContext = React.createContext<UnsplashProviderInterface>(null);

export const useUnsplahApi = () => useContext(UnsplashContext);

const UnsplashProvider: React.FC = ({ children }) => {
  const unsplash = useMemo(() => {
    const unsplashInstance = new Unsplash({
      accessKey: process.env.ACCES_KEY
    });

    console.log(unsplashInstance);

    return {
      listCollections: () => {
        // return unsplashInstance.collections
        //   .listCollections()
        //   .then(res => res.json());

        return Promise.resolve(mockCollections);
      },
      getPhoto: photoId => {
        return unsplashInstance.photos
          .getPhoto(photoId)
          .then(res => res.json());
      },
      getCollectionPhotos: (...args) => {
        return unsplashInstance.collections
          .getCollectionPhotos(...args)
          .then(res => res.json());
      }
    };
  }, []);

  return (
    <UnsplashContext.Provider value={unsplash}>
      {children}
    </UnsplashContext.Provider>
  );
};

const App: React.FC = () => {
  return (
    <UnsplashProvider>
      <Reset />
      <GlobalStyle />
      <Router>
        <Switch>
          <Route path='/photo/:id?' component={Photo} />
          <Route path='/section/:id?' component={Section} />
          <Route path='/' component={Home} />
        </Switch>
      </Router>
    </UnsplashProvider>
  );
};

export default App;
