import { AllProjectsAction } from '../types/AllProjectsActionTypes';
import Project from '../types/Project';

interface AllProjectsState {
  allProjects: Project[];
}

export const allProjectsReducer = (
  state: AllProjectsState,
  action: AllProjectsAction,
) => {
  switch (action.type) {
    case 'GET_ALL_PROJECTS':
      return { allProjects: action.payload };
    default:
      return state;
  }
};
