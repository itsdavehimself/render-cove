import styles from './UserLikes.module.scss';
import ProjectCard from '../../components/ProjectCard/ProjectCard';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { Image } from '../../types/Project';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface LikedProjects {
  projectId: {
    title: string;
    author: {
      avatarUrl: string;
      username: string;
    };
    images: Image[];
    _id: string;
  };
  _id: string;
  timestamp: Date;
}

const UserLikes: React.FC = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [likedProjects, setLikedProjects] = useState<LikedProjects[]>([]);

  useEffect(() => {
    const fetchProjects = async (): Promise<void> => {
      setError(null);
      const projectsReponse = await fetch(`${API_BASE_URL}/collections/likes`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const projectsJson = await projectsReponse.json();

      if (!projectsReponse.ok) {
        setIsLoading(false);
        setError(projectsJson.error);
      }

      if (projectsReponse.ok) {
        setIsLoading(false);
        setLikedProjects(projectsJson);
      }
    };

    fetchProjects();
  }, [user.token]);

  return (
    <main className={styles['likes-container']}>
      <div className={styles.header}>
        <h1>Likes</h1>
        <p>See all the posts you've liked here</p>
      </div>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          {error ? (
            <div>
              There was an error loading the posts. Please try again in a little
              bit.
            </div>
          ) : (
            <section className={styles['post-container']}>
              {likedProjects.length > 0 ? (
                <>
                  {likedProjects.map((project) => (
                    <ProjectCard
                      title={project.projectId.title}
                      author={project.projectId.author.username}
                      avatarUrl={project.projectId.author.avatarUrl}
                      imageUrl={project.projectId.images[0].url}
                      projectId={project.projectId._id}
                      published={true}
                      key={project.projectId._id}
                    />
                  ))}
                </>
              ) : (
                <p>You haven't liked any posts yet</p>
              )}
            </section>
          )}
        </>
      )}
    </main>
  );
};

export default UserLikes;
