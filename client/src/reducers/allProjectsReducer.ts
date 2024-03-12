export const allProjectsReducer = (state, action) => {
  switch (action.type) {
    case 'GET_ALL_PROJECTS':
      return { allProjects: action.payload };
    default:
      return state;
  }
};
