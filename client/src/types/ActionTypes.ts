export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';
export const UPDATE_USER = 'UPDATE_USER';

interface LoginAction {
  type: typeof LOGIN;
  payload: { email: string; displayName: string; token: string };
}

interface LogoutAction {
  type: typeof LOGOUT;
}

interface UpdateAction {
  type: typeof UPDATE_USER;
  payload: UpdatedUserData;
}

type UpdatedUserData = {
  email: string;
  displayName: string;
};

export type AuthAction = LoginAction | LogoutAction | UpdateAction;
