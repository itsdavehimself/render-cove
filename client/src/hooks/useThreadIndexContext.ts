import { ThreadIndexContext } from '../context/ThreadIndexContext';
import { useContext } from 'react';

export const useThreadIndexContext = () => {
  const context = useContext(ThreadIndexContext);

  if (!context) {
    throw Error(
      'useThreadIndexContext must be used inside of a ThreadIndexContextProivder',
    );
  }

  return context;
};
