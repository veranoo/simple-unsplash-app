import React, { useMemo } from 'react';
import Unsplash from 'unsplash-js';

interface Collection {
  id: string;
  title: string;
}

interface Photo {
  downloads: string;
  location: {
    city: string;
  };
}

export interface Urls {
  small: string
}

interface PhotoCollection {
  id: string;
  urls: Urls
}

interface UnsplashProviderInterface {
  listCollections(): Promise<Collection[]>;
  getPhoto(photoId: string): Promise<Photo>;
  abort(): void;
  getCollectionPhotos(
    collectionId: number,
    page: number,
    perPage: number,
    orderBy: string
  ): Promise<PhotoCollection[]>;
}

export const UnsplashContext = React.createContext<UnsplashProviderInterface>(
  null
);

const copyFetch = window.fetch;

export const UnsplashProvider: React.FC = ({ children }) => {
  const unsplash = useMemo(() => {
    const unsplashInstance = new Unsplash({
      accessKey: process.env.ACCESS_KEY
    });

    let controller = new AbortController();
    let signal = controller.signal;
    window.fetch = (input, options) => {
      return copyFetch(input, {
        ...options,
        signal
      });
    };

    return {
      abort: () => {
        controller.abort();
        controller = new AbortController();
        signal = controller.signal;
      },
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
      getCollectionPhotos: async (...args) => {
        const response = await unsplashInstance.collections
          .getCollectionPhotos(...args)
          .then(res => res.json());

        if (response.errors) {
          throw new Error();
        }

        return response;
      }
    };
  }, []);

  return (
    <UnsplashContext.Provider value={unsplash}>
      {children}
    </UnsplashContext.Provider>
  );
};
