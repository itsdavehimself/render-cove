export const userInfoReducer = (state, action) => {
  switch (action.type) {
    case 'GET_INFO':
      return { userInfo: action.payload };
    case 'UPDATE_INFO':
      return { userInfo: action.payload };
    default:
      return state;
  }
};
