import { useUserInfoContext } from '../../../hooks/useUserInfoContext';
import styles from './UserProfileProjects.module.scss';
import ProjectCard from '../../ProjectCard/ProjectCard';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useAllProjectsContext } from '../../../hooks/useAllProjectsContext';
import React from 'react';

const UserProfileProjects: React.FC = () => {
  const { user } = useAuthContext();
  const { userInfo } = useUserInfoContext();
  const { allProjects } = useAllProjectsContext();

  return (
    <>
      <section className={styles['user-profile-projects']}>
        {allProjects && (
          <>
            {allProjects.map((project) => (
              <React.Fragment key={project._id}>
                {user.userId === userInfo._id ? (
                  <ProjectCard
                    title={project.title}
                    author={userInfo.username}
                    imageUrl={project.images[0].url}
                    avatarUrl={userInfo.avatarUrl}
                    projectId={project._id}
                    published={project.published}
                  />
                ) : (
                  <>
                    {project.published === true && (
                      <ProjectCard
                        title={project.title}
                        author={userInfo.username}
                        imageUrl={project.images[0].url}
                        avatarUrl={userInfo.avatarUrl}
                        projectId={project._id}
                        published={project.published}
                      />
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </>
        )}
      </section>
    </>
  );
};

export default UserProfileProjects;
