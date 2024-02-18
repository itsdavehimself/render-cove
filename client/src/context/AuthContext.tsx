import {
  ReactNode,
  createContext,
  useReducer,
  Dispatch,
  useEffect,
} from 'react';
import { authReducer } from '../reducers/authReducer';
import { AuthAction } from '../types/ActionTypes';

interface UserType {
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  summary: string;
  software: string[];
  generators: string[];
  createdAt: Date;
  userId: string;
  website: string;
  tagline: string;
  location: string;
  token: string;
}

interface AuthContextType {
  dispatch: Dispatch<AuthAction>;
  user: UserType;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  useEffect(() => {
    const storedUser: string | null = localStorage.getItem('user');

    if (storedUser) {
      const user: string = JSON.parse(storedUser);
      dispatch({ type: 'LOGIN', payload: user });
    }
  }, []);

  console.log('AuthContext state', state);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
