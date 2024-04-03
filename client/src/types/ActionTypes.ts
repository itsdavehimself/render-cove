import { UserType } from '../context/AuthContext';

export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';

interface LoginAction {
  type: typeof LOGIN;
  payload: UserType;
}

interface LogoutAction {
  type: typeof LOGOUT;
}

interface UpdateAction {
  type: typeof UPDATE_USER;
  payload: UserType;
}

export type AuthAction = LoginAction | LogoutAction | UpdateAction;
