import {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from 'react';
import { useParams } from 'react-router-dom';
import Collection from '../types/Collection';
import { CollectionsAction } from '../types/CollectionsActionTypes';
import { collectionsReducer } from '../reducers/collectionsReducer';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface CollectionsContextType {
  dispatchCollections: Dispatch<CollectionsAction>;
  collections: Collection[];
}

const CollectionsContext = createContext<CollectionsContextType | null>(null);

const CollectionsContextProvider = ({ children }: { children: ReactNode }) => {
  const { username } = useParams();
  const [state, dispatchCollections] = useReducer(collectionsReducer, {
    collections: null,
  });

  useEffect(() => {
    const fetchCollections = async (): Promise<void> => {
      try {
        const collectionsResponse = await fetch(
          `${API_BASE_URL}/collections/${username}`,
          {
            method: 'GET',
          },
        );

        if (collectionsResponse.ok) {
          const collectionsJson = await collectionsResponse.json();
          dispatchCollections({
            type: 'GET_COLLECTIONS',
            payload: collectionsJson,
          });
        } else {
          console.error(collectionsResponse.json());
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchCollections();
  }, [username]);
  return (
    <CollectionsContext.Provider value={{ ...state, dispatchCollections }}>
      {children}
    </CollectionsContext.Provider>
  );
};

export { CollectionsContext, CollectionsContextProvider };
