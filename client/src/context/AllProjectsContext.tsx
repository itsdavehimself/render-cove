import {
  ReactNode,
  createContext,
  useReducer,
  Dispatch,
  useEffect,
} from 'react';
import Project from '../types/Project';
import { useParams } from 'react-router-dom';
import { AllProjectsAction } from '../types/AllProjectsActionTypes';
import { allProjectsReducer } from '../reducers/allProjectsReducer';

interface AllProjectsContextType {
  dispatchAllProjects: Dispatch<AllProjectsAction>;
  allProjects: Project[];
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const AllProjectsContext = createContext<AllProjectsContextType | null>(null);

const AllProjectsContextProvider = ({ children }: { children: ReactNode }) => {
  const { username } = useParams();
  const [state, dispatchAllProjects] = useReducer(allProjectsReducer, {
    allProjects: [],
  });

  useEffect(() => {
    if (username) {
      const fetchUserProjects = async (): Promise<void> => {
        try {
          const projectsResponse = await fetch(
            `${API_BASE_URL}/projects/user/${username}`,
            { method: 'GET' },
          );

          if (projectsResponse.ok) {
            const allProjects = await projectsResponse.json();
            dispatchAllProjects({
              type: 'GET_ALL_PROJECTS',
              payload: allProjects,
            });
          } else {
            console.error(projectsResponse.json());
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserProjects();
    }
  }, [username]);
  return (
    <AllProjectsContext.Provider value={{ ...state, dispatchAllProjects }}>
      {children}
    </AllProjectsContext.Provider>
  );
};

export { AllProjectsContext, AllProjectsContextProvider };
