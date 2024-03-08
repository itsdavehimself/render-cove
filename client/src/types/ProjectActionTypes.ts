import Project from './Project';
import UserInfo from './UserInfo';

export const GET_PROJECT = 'GET_PROJECT';
export const GET_ARTIST = 'GET_ARTIST';
export const UPDATE_PROJECT = 'UPDATE_PROJECT';

interface GetProjectAction {
  type: typeof GET_PROJECT;
  payload: Project;
}
interface GetArtistAction {
  type: typeof GET_ARTIST;
  payload: UserInfo;
}

interface UpdateProjectAction {
  type: typeof UPDATE_PROJECT;
  payload: { project: Project };
}

export type ProjectAction =
  | GetProjectAction
  | GetArtistAction
  | UpdateProjectAction;
