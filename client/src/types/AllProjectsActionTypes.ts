import Project from './Project';

export const GET_ALL_PROJECTS = 'GET_ALL_PROJECTS';

interface GetAllProjectsAction {
  type: typeof GET_ALL_PROJECTS;
  payload: Project[];
}

export type AllProjectsAction = GetAllProjectsAction;
