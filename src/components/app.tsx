import React, { useContext, useMemo } from 'react';
import { Reset } from 'styled-reset';
import { BrowserRouter as Router, Link, Route, Switch } from 'react-router-dom';
// ES Modules syntax
import Unsplash from 'unsplash-js';
import { Photo } from '../pages/photo';
import { Sections } from '../pages/sections';
import { Section } from '../pages/section';
import mockCollections from '../../mocks/collections.json';

interface UnsplashProviderInterface {
  listCollections(): Promise<any[]>;
  listRelatedCollections(collectionId: number): Promise<any>;
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
        // return unsplashInstance.collecions.listCollections.then(res =>
        //   res.json()
        // );

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
      },
      listRelatedCollections: collectionId => {
        return unsplashInstance.collections
          .listRelatedCollections(collectionId)
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
      <Router>
        <div>
          <nav>
            <Link to='/'>Home</Link>
          </nav>
          <Switch>
            <Route path='/photo/:id?' component={Photo} />
            <Route path='/section/:id?' component={Section} />
            <Route path='/' component={Sections} />
          </Switch>
        </div>
      </Router>
    </UnsplashProvider>
  );
};

export default App;
