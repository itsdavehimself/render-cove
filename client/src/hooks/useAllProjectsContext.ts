import { AllProjectsContext } from '../context/AllProjectsContext';
import { useContext } from 'react';

export const useAllProjectsContext = () => {
  const context = useContext(AllProjectsContext);

  if (!context) {
    throw Error(
      'useAllProjectContext must be used inside of an AllProjectsContextProvider',
    );
  }

  return context;
};
