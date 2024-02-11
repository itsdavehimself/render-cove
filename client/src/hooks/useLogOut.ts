import { useAuthContext } from './useAuthContext';

interface LogOutResult {
  logOut: () => void;
}

const useLogOut = (): LogOutResult => {
  const { dispatch } = useAuthContext();

  const logOut = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  return { logOut };
};

export default useLogOut;
