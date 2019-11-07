import { useContext } from 'react';
import { UnsplashContext } from '../providers/unsplash-provider';

export const useUnsplashApi = () => useContext(UnsplashContext);
