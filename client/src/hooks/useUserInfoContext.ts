import { UserInfoContext } from '../context/UserInfoContext';
import { useContext } from 'react';

export const useUserInfoContext = () => {
  const context = useContext(UserInfoContext);

  if (!context) {
    throw Error(
      'useUserInfoContext must be used inside of an UserInfoContextProvider',
    );
  }

  return context;
};
