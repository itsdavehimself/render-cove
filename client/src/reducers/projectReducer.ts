export const projectReducer = (state, action) => {
  switch (action.type) {
    case 'GET_PROJECT':
      return { ...state, project: action.payload.project };
    case 'GET_ARTIST':
      return { ...state, artist: action.payload.artist };
    case 'UPDATE_PROJECT':
      return { ...state, project: action.payload.project };
    default:
      return state;
  }
};
