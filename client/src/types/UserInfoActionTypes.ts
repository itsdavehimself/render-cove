import { UserType } from '../context/AuthContext';

export const GET_INFO = 'GET_INFO';
export const UPDATE_INFO = 'UPDATE_INFO';

interface GetInfoAction {
  type: typeof GET_INFO;
  payload: UserType;
}

interface UpdateInfoAction {
  type: typeof UPDATE_INFO;
  payload: UserType;
}

export type UserInfoAction = GetInfoAction | UpdateInfoAction;
