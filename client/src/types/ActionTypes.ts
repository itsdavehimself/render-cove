export const LOGIN = 'LOGIN';
export const LOGOUT = 'LOGOUT';

interface LoginAction {
  type: typeof LOGIN;
  payload: { email: string; displayName: string; token: string };
}

interface LogoutAction {
  type: typeof LOGOUT;
}

export type AuthAction = LoginAction | LogoutAction;
