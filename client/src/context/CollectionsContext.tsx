import {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
  useState,
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
  isLoadingCollections: boolean;
}

const CollectionsContext = createContext<CollectionsContextType | null>(null);

const CollectionsContextProvider = ({ children }: { children: ReactNode }) => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [state, dispatchCollections] = useReducer(collectionsReducer, {
    collections: [],
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
          console.error(await collectionsResponse.json());
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCollections();
  }, [username]);

  return (
    <CollectionsContext.Provider
      value={{ ...state, dispatchCollections, isLoadingCollections: isLoading }}
    >
      {children}
    </CollectionsContext.Provider>
  );
};

export { CollectionsContext, CollectionsContextProvider };
