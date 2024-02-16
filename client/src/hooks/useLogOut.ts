import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

interface LogOutResult {
  logOut: () => void;
}

const useLogOut = (): LogOutResult => {
  const { dispatch } = useAuthContext();
  const navigate = useNavigate();

  const logOut = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  };

  return { logOut };
};

export default useLogOut;
