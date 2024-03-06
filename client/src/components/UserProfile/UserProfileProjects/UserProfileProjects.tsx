import { useUserInfoContext } from '../../../hooks/useUserInfoContext';
import styles from './UserProfileProjects.module.scss';
import { useEffect, useState } from 'react';
import Project from '../../../types/Project';
import ProjectCard from '../../ProjectCard/ProjectCard';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserProfileProjects: React.FC = () => {
  const { userInfo } = useUserInfoContext();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (userInfo) {
      const fetchUserProjects = async (): Promise<void> => {
        try {
          const projectsResponse = await fetch(
            `${API_BASE_URL}/projects/user/${userInfo._id}`,
            { method: 'GET' },
          );

          if (projectsResponse.ok) {
            const allProjects = await projectsResponse.json();
            setProjects(allProjects);
            setIsLoading(false);
          } else {
            console.error(projectsResponse.json());
          }
        } catch (error) {
          console.error(error);
        }
      };
      fetchUserProjects();
    }
  }, [userInfo]);
  return (
    <>
      <section className={styles['user-profile-projects']}>
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <>
            {projects && (
              <>
                {projects.map((project) => (
                  <ProjectCard
                    title={project.title}
                    author={userInfo.username}
                    imageUrl={project.images[0].url}
                    avatarUrl={userInfo.avatarUrl}
                    projectId={project._id}
                    key={project._id}
                  />
                ))}
              </>
            )}
          </>
        )}
      </section>
    </>
  );
};

export default UserProfileProjects;