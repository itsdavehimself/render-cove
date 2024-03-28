import Project from '../../types/Project';
import LargeLoadingSpinner from '../LargeLoadingSpinner/LargeLoadingSpinner';
import ProjectCard from '../ProjectCard/ProjectCard';
import styles from './ExploreProjects.module.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const ExploreProjects: React.FC = () => {
  const { tag } = useParams();
  const [projects, setProjects] = useState<Project[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProjects = async () => {
      let projectsUrl;

      if (tag) {
        projectsUrl = `${API_BASE_URL}/projects/tag/${tag}`;
      } else {
        projectsUrl = `${API_BASE_URL}/projects/featured`;
      }

      const projectsResponse = await fetch(projectsUrl, {
        method: 'GET',
      });

      const projectsJson = await projectsResponse.json();

      if (!projectsResponse.ok) {
        setError(projectsJson.error);
      } else {
        setProjects(projectsJson);
      }

      setIsLoading(false);
    };

    fetchProjects();
  }, [tag]);

  return (
    <>
      {isLoading ? (
        <LargeLoadingSpinner />
      ) : (
        <section className={styles['project-cards']}>
          {projects.map((project) => (
            <ProjectCard
              title={project?.title}
              authorDisplayName={project?.author.displayName}
              authorUsername={project?.author.username}
              imageUrl={project?.images[0].url}
              avatarUrl={project?.author.avatarUrl}
              projectId={project?._id}
              published={project?.published}
              key={project?._id}
            />
          ))}
        </section>
      )}
    </>
  );
};

export default ExploreProjects;
