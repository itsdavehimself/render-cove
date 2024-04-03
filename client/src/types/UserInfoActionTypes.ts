import { UserInfoType } from '../context/UserInfoContext';

export const GET_INFO = 'GET_INFO';
export const UPDATE_INFO = 'UPDATE_INFO';

interface GetInfoAction {
  type: typeof GET_INFO;
  payload: UserInfoType;
}

interface UpdateInfoAction {
  type: typeof UPDATE_INFO;
  payload: UserInfoType;
}

export type UserInfoAction = GetInfoAction | UpdateInfoAction;
