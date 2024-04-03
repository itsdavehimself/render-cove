import { AuthAction } from '../types/ActionTypes';
import { UserType } from '../context/AuthContext';

interface AuthState {
  user: UserType | null;
}

export const authReducer = (state: AuthState, action: AuthAction) => {
  switch (action.type) {
    case 'LOGIN':
      return { user: action.payload };
    case 'LOGOUT':
      return { user: null };
    case 'UPDATE_USER':
      return { user: action.payload };
    default:
      return state;
  }
};
