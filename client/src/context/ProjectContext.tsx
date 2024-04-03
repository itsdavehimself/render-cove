import {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from 'react';
import { useParams } from 'react-router-dom';
import Project from '../types/Project';
import { ProjectAction } from '../types/ProjectActionTypes';
import { projectReducer } from '../reducers/projectReducer';
import UserInfo from '../types/UserInfo';

interface ProjectContextType {
  dispatchProject: Dispatch<ProjectAction>;
  project: Project | null;
  artist: UserInfo | null;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const ProjectContext = createContext<ProjectContextType | null>(null);

const ProjectContextProvider = ({ children }: { children: ReactNode }) => {
  const { projectId } = useParams();
  const [state, dispatchProject] = useReducer(projectReducer, {
    project: null,
    artist: null,
  });

  useEffect(() => {
    const fetchProjectInfo = async (): Promise<void> => {
      try {
        const projectInfoResponse = await fetch(
          `${API_BASE_URL}/projects/${projectId}`,
          {
            method: 'GET',
          },
        );

        if (projectInfoResponse.ok) {
          const projectInfoData = await projectInfoResponse.json();
          dispatchProject({
            type: 'GET_PROJECT',
            payload: projectInfoData,
          });

          const artistInfoResponse = await fetch(
            `${API_BASE_URL}/users/${projectInfoData.author}`,
            {
              method: 'GET',
            },
          );

          if (artistInfoResponse.ok) {
            const artistInfoData = await artistInfoResponse.json();
            dispatchProject({
              type: 'GET_ARTIST',
              payload: artistInfoData,
            });
          } else {
            console.error(artistInfoResponse.json());
          }
        } else {
          console.error(projectInfoResponse.json());
        }
      } catch (error) {
        console.error(error);
      }
    };
    fetchProjectInfo();
  }, [projectId]);
  return (
    <ProjectContext.Provider value={{ ...state, dispatchProject }}>
      {children}
    </ProjectContext.Provider>
  );
};

export { ProjectContext, ProjectContextProvider };
