import ProjectPageSidebar from '../../components/ProjectPage/ProjectPageSidebar/ProjectPageSidebar';
import styles from './ProjectPage.module.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectPageMainContent from '../../components/ProjectPage/ProjectPageMainContent/ProjectPageMainContent';
import { GenerationData } from '../../types/Project';
import { useProjectContext } from '../../hooks/useProjectContext';
import { useAuthContext } from '../../hooks/useAuthContext';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const { project, artist } = useProjectContext();
  const { user } = useAuthContext();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [generationData, setGenerationData] = useState<GenerationData>({
    prompt: '',
    negativePrompt: '',
    model: '',
    seed: 0,
    cfgScale: 0,
    steps: 0,
    sampler: '',
  });

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

  useEffect(() => {
    if (user && artist) {
      setIsLoading(false);
    }
  }, [user, artist]);

  return (
    <>
      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <>
          {!project?.published && user?.userId !== artist?._id ? (
            <div>Project is not published</div>
          ) : (
            <div className={styles['project-container']}>
              <main className={styles.main}>
                <ProjectPageMainContent
                  generationData={generationData}
                  setGenerationData={setGenerationData}
                />
              </main>
              <aside className={styles.sidebar}>
                <ProjectPageSidebar
                  generationData={generationData}
                  API_BASE_URL={API_BASE_URL}
                />
              </aside>
            </div>
          )}
        </>
      )}
    </>
  );
};

export default ProjectPage;
