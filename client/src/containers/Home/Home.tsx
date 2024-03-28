import styles from './Home.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import Project from '../../types/Project';
import LargeLoadingSpinner from '../../components/LargeLoadingSpinner/LargeLoadingSpinner';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const Home: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const rightArrow: React.ReactNode = <FontAwesomeIcon icon={faArrowRight} />;

  useEffect(() => {
    const fetchProjects = async () => {
      const projectsResponse = await fetch(
        `${API_BASE_URL}/projects/featured`,
        {
          method: 'GET',
        },
      );

      const projectsJson = await projectsResponse.json();

      if (!projectsResponse.ok) {
        setError(projectsJson.error);
        setIsLoading(false);
      }

      if (projectsResponse.ok) {
        setProjects(projectsJson);
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <main className={styles['home-page']}>
      <header className={styles['home-header']}>
        <h1>Featured Projects</h1>
        <Link to="/explore">
          <div className={styles['explore-link']}>
            <p>Exlore all projects</p>
            {rightArrow}
          </div>
        </Link>
      </header>
      {isLoading ? (
        <LargeLoadingSpinner />
      ) : (
        <section className={styles['project-cards']}>
          {projects?.map((project) => (
            <ProjectCard
              title={project?.title}
              authorDisplayName={project?.author.displayName}
              authorUsername={project?.author.username}
              avatarUrl={project?.author.avatarUrl}
              imageUrl={project?.images[0].url}
              projectId={project?._id}
              published={project?.published}
            />
          ))}
        </section>
      )}
    </main>
  );
};

export default Home;
