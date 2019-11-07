export const SET_ERROR = 'SET_ERROR';
export const SET_PHOTOS = 'SET_PHOTOS';
export const SET_LOAD_MORE = 'SET_LOAD_MORE';
export const SET_NOT_LOAD_MORE = 'SET_NOT_LOAD_MORE';
export const SET_LOAD_MORE_ERROR = 'SET_LOAD_MORE_ERROR';

export const sectionReducer = (state, action) => {
  switch (action.type) {
    case SET_ERROR:
      return {
        ...state,
        hasMore: false,
        error: true,
        photos: []
      };

    case SET_PHOTOS:
      return {
        ...state,
        photos: action.payload.photos,
        hasMore: true
      };

    case SET_LOAD_MORE:
      return {
        ...state,
        photos: [...state.photos, ...action.payload.photos],
        hasMore: true
      };

    case SET_NOT_LOAD_MORE:
      return {
        ...state,
        hasMore: false
      };

    case SET_LOAD_MORE_ERROR:
      return {
        ...state,
        error: true,
        hasMore: false
      };
  }
};
