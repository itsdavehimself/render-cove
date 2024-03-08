import ProjectPageSidebar from '../../components/ProjectPage/ProjectPageSidebar/ProjectPageSidebar';
import styles from './ProjectPage.module.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectPageMainContent from '../../components/ProjectPage/ProjectPageMainContent/ProjectPageMainContent';
import { GenerationData } from '../../types/Project';
import { ProjectContextProvider } from '../../context/ProjectContext';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const ProjectPage: React.FC = () => {
  const { projectId } = useParams();
  const [generationData, setGenerationData] = useState<GenerationData>({
    prompt: '',
    negativePrompt: '',
    model: '',
    seed: 0,
    cfgScale: 0,
    steps: 0,
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

  return (
    <ProjectContextProvider>
      <div className={styles['project-container']}>
        <main className={styles.main}>
          <ProjectPageMainContent
            generationData={generationData}
            setGenerationData={setGenerationData}
          />
        </main>
        <aside className={styles.sidebar}>
          <ProjectPageSidebar generationData={generationData} />
        </aside>
      </div>
    </ProjectContextProvider>
  );
};

export default ProjectPage;
