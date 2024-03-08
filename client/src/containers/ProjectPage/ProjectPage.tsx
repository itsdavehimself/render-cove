import ProjectPageSidebar from '../../components/ProjectPage/ProjectPageSidebar/ProjectPageSidebar';
import styles from './ProjectPage.module.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Project from '../../types/Project';
import UserInfo from '../../types/UserInfo';
import ProjectPageMainContent from '../../components/ProjectPage/ProjectPageMainContent/ProjectPageMainContent';
import { GenerationData } from '../../types/Project';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const [projectInfo, setProjectInfo] = useState<Project | undefined>();
  const [artistInfo, setArtistInfo] = useState<UserInfo | undefined>();
  const [generationData, setGenerationData] = useState<GenerationData>({
    prompt: '',
    negativePrompt: '',
    model: '',
    seed: 0,
    cfgScale: 0,
    steps: 0,
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
          setProjectInfo(projectInfoData);

          const artistInfoResponse = await fetch(
            `${API_BASE_URL}/users/${projectInfoData.author}`,
            {
              method: 'GET',
            },
          );

          if (artistInfoResponse.ok) {
            const artistInfoData = await artistInfoResponse.json();
            setArtistInfo(artistInfoData);
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

  useEffect(() => {
    const incrementViews = async (): Promise<void> => {
      try {
        const viewsResponse = await fetch(
          `${API_BASE_URL}/projects/views/${projectId}`,
          {
            method: 'PATCH',
          },
        );

        if (!viewsResponse.ok) {
          console.error(
            `Failed to increment views. Status: ${viewsResponse.status}`,
          );
        }
      } catch (error) {
        console.error('An error occurred while incrementing views:', error);
      }
    };

    incrementViews();
  }, [projectId]);

  return (
    <div className={styles['project-container']}>
      <main className={styles.main}>
        <ProjectPageMainContent
          projectInfo={projectInfo}
          generationData={generationData}
          setGenerationData={setGenerationData}
        />
      </main>
      <aside className={styles.sidebar}>
        <ProjectPageSidebar
          projectInfo={projectInfo}
          artistInfo={artistInfo}
          generationData={generationData}
        />
      </aside>
    </div>
  );
};

export default ProjectPage;
