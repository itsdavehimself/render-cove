import styles from './ProjectPageSidebar.module.scss';
import Project from '../../../types/Project';
import UserInfo from '../../../types/UserInfo';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faCheck,
  faUserMinus,
  faEnvelope,
  faEllipsisVertical,
  faEye,
  faThumbsUp,
  faComment,
} from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { FollowAction, handleFollowClick } from './ProjectPageSidebar.utility';
import { formatDistanceToNowStrict } from 'date-fns';
import TagDisplay from '../../TagDisplay/TagDisplay';
import TextAreaInput from '../../TextAreaInput/TextAreaInput';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';

interface ProjectPageSidebarProps {
  projectInfo: Project | undefined;
  artistInfo: UserInfo | undefined;
}

const ProjectPageSidebar: React.FC<ProjectPageSidebarProps> = ({
  projectInfo,
  artistInfo,
}) => {
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isHoveringFollowButton, setIsHoveringFollowButton] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [comment, setComment] = useState<string>('');

  const followIcon: React.ReactNode = <FontAwesomeIcon icon={faUserPlus} />;
  const checkIcon: React.ReactNode = <FontAwesomeIcon icon={faCheck} />;
  const unfollowIcon: React.ReactNode = <FontAwesomeIcon icon={faUserMinus} />;
  const messageIcon: React.ReactNode = <FontAwesomeIcon icon={faEnvelope} />;
  const ellipsisIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faEllipsisVertical} />
  );
  const viewIcon: React.ReactNode = <FontAwesomeIcon icon={faEye} />;
  const likeIcon: React.ReactNode = <FontAwesomeIcon icon={faThumbsUp} />;
  const commentIcon: React.ReactNode = <FontAwesomeIcon icon={faComment} />;

  useEffect(() => {
    if (user && artistInfo && artistInfo.followers) {
      setIsFollowing(user.following.includes(artistInfo._id));
    }
  }, [user, artistInfo]);

  return (
    <aside className={styles['project-sidebar-container']}>
      <section className={styles['project-info']}>
        <section className={styles['artist-info-container']}>
          <div className={styles['artist-info']}>
            <div className={styles['user-avatar-container']}>
              <img src={artistInfo?.avatarUrl}></img>
            </div>
            <div className={styles['artist-details']}>
              <h3>{artistInfo?.displayName}</h3>
              <p className={styles['artist-tagline']}>{artistInfo?.tagline}</p>
            </div>
            <button className={styles['ellipsis-button']}>
              {ellipsisIcon}
            </button>
          </div>
          {artistInfo && (
            <>
              {!user ||
                (artistInfo.username !== user.username && (
                  <div className={styles['user-contact-buttons']}>
                    {isFollowing ? (
                      <button
                        className={styles['follow-user-button-unfollow']}
                        onClick={
                          !user
                            ? () => navigate('/login')
                            : () =>
                                handleFollowClick(
                                  FollowAction.Unfollow,
                                  setError,
                                  setIsLoading,
                                  artistInfo,
                                  user,
                                  isFollowing,
                                  setIsFollowing,
                                  dispatch,
                                )
                        }
                        disabled={isLoading}
                        onMouseEnter={() => setIsHoveringFollowButton(true)}
                        onMouseLeave={() => setIsHoveringFollowButton(false)}
                      >
                        {!isHoveringFollowButton ? (
                          <>{checkIcon} Following</>
                        ) : (
                          <>{unfollowIcon} Unfollow</>
                        )}
                      </button>
                    ) : (
                      <button
                        className={styles['follow-user-button']}
                        onClick={
                          !user
                            ? () => navigate('/login')
                            : () =>
                                handleFollowClick(
                                  FollowAction.Follow,
                                  setError,
                                  setIsLoading,
                                  artistInfo,
                                  user,
                                  isFollowing,
                                  setIsFollowing,
                                  dispatch,
                                )
                        }
                        disabled={isLoading}
                      >
                        {followIcon} Follow
                      </button>
                    )}
                    <button className={styles['message-user-button']}>
                      {messageIcon} Message
                    </button>
                    {error && (
                      <div className={styles['error-message']}>
                        {error.message}
                      </div>
                    )}
                  </div>
                ))}
            </>
          )}
        </section>
        <section className={styles['info-container']}>
          <div className={styles['overview-container']}>
            <h1 className={styles.title}>{projectInfo?.title}</h1>
            <p className={styles.date}>
              Posted{' '}
              {projectInfo?.createdAt &&
                formatDistanceToNowStrict(projectInfo?.createdAt)}{' '}
              ago
            </p>
          </div>
          <p className={styles.description}>{projectInfo?.description}</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span>{viewIcon}</span>
              {projectInfo?.views} views
            </div>
            <div className={styles.stat}>
              <span>{likeIcon}</span>
              {projectInfo?.likes.length} likes
            </div>
            <div className={styles.stat}>
              <span>{commentIcon}</span>
              {projectInfo?.comments.length} comments
            </div>
          </div>
          <TagDisplay header="Tags" tagList={projectInfo?.tags} />
          <TagDisplay
            header="Software used"
            tagList={projectInfo?.softwareList}
          />
          <TagDisplay
            header="Hardware used"
            tagList={Object.values(projectInfo?.hardware || {})}
          />
        </section>
      </section>
      <section className={styles.comments}>
        <form>
          <h4 className={styles['comments-header']}>
            {projectInfo?.comments.length} Comments
          </h4>
          <TextAreaInput
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            label=""
            name="comment"
            id="comment"
          />
          <div className={styles['comment-button']}>
            <SaveSubmitButton label="Sumbit" isLoading={false} color="blue" />
          </div>
        </form>
      </section>
    </aside>
  );
};

export default ProjectPageSidebar;
