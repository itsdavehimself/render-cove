export const collectionsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_COLLECTIONS':
      return { collections: action.payload };
    default:
      return state;
  }
};
