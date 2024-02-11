import { ReactNode, createContext, useReducer, Dispatch } from 'react';
import { authReducer } from '../reducers/authReducer';
import { AuthAction } from '../types/ActionTypes';

interface AuthContextType {
  dispatch: Dispatch<AuthAction>;
}

const AuthContext = createContext<AuthContextType | null>(null);

const AuthContextProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, {
    user: null,
  });

  console.log('AuthContext state', state);
  return (
    <AuthContext.Provider value={{ ...state, dispatch }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthContextProvider };
