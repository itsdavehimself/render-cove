import styles from './ProjectPageSidebar.module.scss';
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
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, FormEvent } from 'react';
import { FollowAction, handleFollowClick } from './ProjectPageSidebar.utility';
import { formatDistanceToNowStrict } from 'date-fns';
import TagDisplay from '../../TagDisplay/TagDisplay';
import TextAreaInput from '../../TextAreaInput/TextAreaInput';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import { GenerationData } from '../../../types/Project';
import { useProjectContext } from '../../../hooks/useProjectContext';
import Comment from '../../Comment/Comment';

interface ProjectPageSidebarProps {
  generationData: GenerationData;
  API_BASE_URL: string;
}

const ProjectPageSidebar: React.FC<ProjectPageSidebarProps> = ({
  generationData,
  API_BASE_URL,
}) => {
  const { user, dispatch } = useAuthContext();
  const { project, artist, dispatchProject } = useProjectContext();
  const navigate = useNavigate();
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isHoveringFollowButton, setIsHoveringFollowButton] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [comment, setComment] = useState<string>('');
  const [commentsToShow, setCommentsToShow] = useState<number>(5);
  const [hardwareArray, setHardwareArray] = useState<string[]>([]);

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
  const editIcon: React.ReactNode = <FontAwesomeIcon icon={faPenToSquare} />;

  useEffect(() => {
    if (user && artist && artist.followers) {
      setIsFollowing(user.following.includes(artist._id));
    }
  }, [user, artist]);

  const handleCommentSubmit = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    const commentResponse = await fetch(
      `${API_BASE_URL}/projects/comment/${project._id}`,
      {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({ comment }),
      },
    );

    const commentJson = await commentResponse.json();

    if (!commentResponse.ok) {
      setError(new Error(commentJson.error));
      setIsLoading(false);
    }

    if (commentResponse.ok) {
      setError(null);
      setIsLoading(false);
      setComment('');
      dispatchProject({
        type: 'UPDATE_PROJECT',
        payload: { project: commentJson },
      });
    }
  };

  useEffect(() => {
    if (project) {
      const hardwareArray = Object.entries(project?.hardware).map(
        ([key, value]) => {
          if (key === 'ram' && value !== null) {
            return `${value}GB RAM`;
          } else {
            return value;
          }
        },
      );
      setHardwareArray(hardwareArray);
    }
  }, [project]);

  return (
    <aside className={styles['project-sidebar-container']}>
      <section className={styles['project-info']}>
        <section className={styles['artist-info-container']}>
          <div className={styles['artist-info']}>
            <div
              className={styles['user-avatar-container']}
              onClick={() => navigate(`/user/${artist?.username}`)}
            >
              <img src={artist?.avatarUrl}></img>
            </div>
            <div className={styles['artist-details']}>
              <h3 onClick={() => navigate(`/user/${artist?.username}`)}>
                {artist?.displayName}
              </h3>
              <p className={styles['artist-tagline']}>{artist?.tagline}</p>
            </div>
            <button className={styles['ellipsis-button']}>
              {ellipsisIcon}
            </button>
          </div>
          {artist && (
            <>
              {!user ||
                (artist.username !== user.username && (
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
                                  artist,
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
                                  artist,
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
            <h1 className={styles.title}>{project?.title}</h1>
            <p className={styles.date}>
              Posted{' '}
              {project?.createdAt &&
                formatDistanceToNowStrict(project?.createdAt)}{' '}
              ago
            </p>
          </div>
          <p className={styles.description}>{project?.description}</p>
          <div className={styles.stats}>
            <div className={styles.stat}>
              <span>{viewIcon}</span>
              {project?.views} views
            </div>
            <div className={styles.stat}>
              <span>{likeIcon}</span>
              {project?.likes.length}{' '}
              {project?.likes.length === 1 ? 'like' : 'likes'}
            </div>
            <div className={styles.stat}>
              <span>{commentIcon}</span>
              {project?.comments.length}{' '}
              {project?.comments.length === 1 ? 'comment' : 'comments'}
            </div>
          </div>
          {user?.userId === artist?._id && (
            <button
              className={styles['edit-project-button']}
              onClick={() => navigate(`/project/edit/${project._id}`)}
            >
              <span>{editIcon}</span> Edit project
            </button>
          )}
        </section>
        <section className={styles['generation-data']}>
          <div className={styles['header-with-instructions']}>
            <h4 className={styles['generation-header']}>Generation Data </h4>
            <p className={styles.instructions}>
              Click generation data button on an image to populate
            </p>
          </div>
          <div className={styles.prompts}>
            <div className={styles['data-container']}>
              <h5>Prompt</h5>
              <div className={styles['data-box']}>{generationData.prompt}</div>
            </div>
            <div className={styles['data-container']}>
              <h5>Negative Prompt</h5>
              <div className={styles['data-box']}>
                {generationData.negativePrompt}
              </div>
            </div>
            <div className={styles['data-container']}>
              <h5>Model</h5>
              <div className={styles['data-box']}>{generationData.model}</div>
            </div>
          </div>
          <div className={styles.configurations}>
            <div className={styles['data-container']}>
              <h5>Seed</h5>
              <div className={styles['data-box']}>{generationData.seed}</div>
            </div>
            <div className={styles['data-container']}>
              <h5>Sampler</h5>
              <div className={styles['data-box']}>{generationData.sampler}</div>
            </div>
            <div className={styles['data-container']}>
              <h5>Steps</h5>
              <div className={styles['data-box']}>{generationData.steps}</div>
            </div>
            <div className={styles['data-container']}>
              <h5>CFG Scale</h5>
              <div className={styles['data-box']}>
                {generationData.cfgScale}
              </div>
            </div>
          </div>
        </section>
        <TagDisplay header="Tags" tagList={project?.tags} />
        <TagDisplay header="Software used" tagList={project?.softwareList} />
        {!(
          hardwareArray[0] === '' &&
          hardwareArray[1] === '' &&
          hardwareArray[2] === undefined
        ) && (
          <TagDisplay header="Hardware used" tagList={hardwareArray || {}} />
        )}
      </section>
      <section className={styles.comments}>
        {project.commentsAllowed ? (
          <form onSubmit={handleCommentSubmit}>
            <h4 className={styles['comments-header']}>
              {project?.comments.length}{' '}
              {project?.comments.length === 1 ? 'Comment' : 'Comments'}
            </h4>
            {project?.comments.length > 0 && (
              <div className={styles['comments-list']}>
                {project?.comments
                  .slice(0, commentsToShow)
                  .map((comment) => (
                    <Comment
                      author={comment.author}
                      comment={comment.content}
                      date={comment.timestamp}
                      likes={comment.likes}
                      id={comment._id}
                      key={comment._id}
                      setError={setError}
                    />
                  ))}
                {commentsToShow < project?.comments.length && (
                  <button
                    className={styles['load-comments-button']}
                    type="button"
                    onClick={() => setCommentsToShow(commentsToShow + 5)}
                  >
                    Load More Comments
                  </button>
                )}
              </div>
            )}
            {user ? (
              <>
                <TextAreaInput
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  label=""
                  name="comment"
                  id="comment"
                  placeholder={
                    project?.comments.length === 0
                      ? 'Be the first to comment...'
                      : 'Join the conversation...'
                  }
                  serverError={error ? error.message : ''}
                />
                <div className={styles['comment-button']}>
                  <SaveSubmitButton
                    label="Sumbit"
                    isLoading={false}
                    color="blue"
                  />
                </div>
              </>
            ) : (
              <div className={styles['login']}>
                <div className={styles['login-text']}>
                  <span className={styles['login-link']}>
                    <Link to="/login">Log In</Link>
                  </span>{' '}
                  to comment
                </div>
              </div>
            )}
          </form>
        ) : (
          <>
            <h4 className={styles['comments-header']}>Comments</h4>
            <p className={styles['comments-disabled']}>
              Comments have been disabled for this post.
            </p>
          </>
        )}
      </section>
    </aside>
  );
};

export default ProjectPageSidebar;
