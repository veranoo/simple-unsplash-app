import React, { useMemo } from 'react';
import Unsplash from 'unsplash-js';

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

export const UnsplashContext = React.createContext<UnsplashProviderInterface>(null);

export const UnsplashProvider: React.FC = ({ children }) => {
  const unsplash = useMemo(() => {
    const unsplashInstance = new Unsplash({
      accessKey: process.env.ACCES_KEY
    });

    return {
      listCollections: () => {
        return unsplashInstance.collections
          .listCollections()
          .then(res => res.json());
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
