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
      <section className={styles['projects-container']}>
        {allProjects && allProjects?.length > 0 && (
          <div className={styles['user-profile-projects']}>
            <>
              {allProjects.map((project) => (
                <React.Fragment key={project._id}>
                  {user?.userId === userInfo?._id ? (
                    <ProjectCard
                      title={project?.title}
                      authorDisplayName={project?.author.displayName}
                      authorUsername={project?.author.username}
                      imageUrl={project?.images[0].url}
                      avatarUrl={project?.author.avatarUrl}
                      projectId={project?._id}
                      published={project?.published}
                    />
                  ) : (
                    <>
                      {project.published === true && (
                        <ProjectCard
                          title={project?.title}
                          authorDisplayName={project?.author.displayName}
                          authorUsername={project?.author.username}
                          imageUrl={project?.images[0].url}
                          avatarUrl={project?.author.avatarUrl}
                          projectId={project?._id}
                          published={project?.published}
                        />
                      )}
                    </>
                  )}
                </React.Fragment>
              ))}
            </>
          </div>
        )}
      </section>
      {allProjects?.length === 0 && (
        <div className={styles['missing-message']}>
          This user doesn't have any projects yet.
        </div>
      )}
    </>
  );
};

export default UserProfileProjects;
