import { CollectionsContext } from '../context/CollectionsContext';
import { useContext } from 'react';

export const useCollectionsContext = () => {
  const context = useContext(CollectionsContext);

  if (!context) {
    throw Error(
      'useCollectionsContext must be used inside of an CollectionsContextProvider',
    );
  }

  return context;
};
