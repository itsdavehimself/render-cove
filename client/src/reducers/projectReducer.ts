import { ProjectAction } from '../types/ProjectActionTypes';
import Project from '../types/Project';
import UserInfo from '../types/UserInfo';

interface ProjectState {
  project: Project | null;
  artist: UserInfo | null;
}

export const projectReducer = (
  state: ProjectState,
  action: ProjectAction,
): ProjectState => {
  switch (action.type) {
    case 'GET_PROJECT':
      return { ...state, project: action.payload };
    case 'GET_ARTIST':
      return { ...state, artist: action.payload };
    case 'UPDATE_PROJECT':
      return { ...state, project: action.payload.project };
    default:
      return state;
  }
};
