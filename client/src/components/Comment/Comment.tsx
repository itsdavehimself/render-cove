import styles from './Comment.module.scss';
import { Like } from '../../types/Project';
import { useState, useEffect } from 'react';
import UserInfo from '../../types/UserInfo';
import { formatDistanceToNowStrict } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faThumbsUp,
  faEllipsis,
  faTrash,
  faFlag,
} from '@fortawesome/free-solid-svg-icons';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useProjectContext } from '../../hooks/useProjectContext';
import { useNavigate } from 'react-router-dom';
import PopOutMenu from '../PopOutMenu/PopOutMenu';

interface CommentProps {
  author: string;
  comment: string;
  date: Date;
  likes: Like[];
  id: string;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const Comment: React.FC<CommentProps> = ({
  author,
  comment,
  date,
  likes,
  id,
  setError,
}) => {
  const [authorInfo, setAuthorInfo] = useState<UserInfo | undefined>();
  const { user } = useAuthContext();
  const navigate = useNavigate();
  const { project, dispatchProject } = useProjectContext();
  const [isCommentLiked, setIsCommentLiked] = useState<boolean | undefined>(
    false,
  );
  const [isShowingFullComment, setIsShowingFullComment] =
    useState<boolean>(false);
  const [isCommentOptionsOpen, setIsCommentOptionsOpen] =
    useState<boolean>(false);

  const MAX_COMMENT_LENGTH = 250;
  const truncatedComment =
    comment.length > MAX_COMMENT_LENGTH
      ? comment.slice(0, MAX_COMMENT_LENGTH) + '...'
      : comment;

  const likeIcon: React.ReactNode = <FontAwesomeIcon icon={faThumbsUp} />;
  const moreIcon: React.ReactNode = <FontAwesomeIcon icon={faEllipsis} />;
  const deleteIcon: React.ReactNode = <FontAwesomeIcon icon={faTrash} />;
  const reportIcon: React.ReactNode = <FontAwesomeIcon icon={faFlag} />;

  const handleProfileClick = (): void => {
    navigate(`/user/${authorInfo?.username}`);
  };

  useEffect(() => {
    const fetchAuthorInfo = async (): Promise<void> => {
      const authorResponse = await fetch(`${API_BASE_URL}/users/${author}`, {
        method: 'GET',
      });

      const authorJson = await authorResponse.json();

      if (!authorResponse.ok) {
        setError(new Error(authorJson.error));
      }

      if (authorResponse.ok) {
        setAuthorInfo(authorJson);
      }
    };

    fetchAuthorInfo();
  }, [author]);

  const handleDeleteComment = async (): Promise<void> => {
    try {
      const deleteResponse = await fetch(
        `${API_BASE_URL}/projects/comment/${project?._id}`,
        {
          method: 'DELETE',
          body: JSON.stringify({ id }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );

      if (!deleteResponse.ok) {
        setError(
          new Error(
            `Failed to delete the comment. Status: ${deleteResponse.status}`,
          ),
        );
      }

      const deleteJson = await deleteResponse.json();

      if (deleteResponse.ok) {
        dispatchProject({
          type: 'UPDATE_PROJECT',
          payload: { project: deleteJson },
        });
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleLikeCommentClick = async (): Promise<void> => {
    try {
      const likeResponse = await fetch(
        `${API_BASE_URL}/projects/comment/like/${project?._id}`,
        {
          method: 'PATCH',
          body: JSON.stringify({ id }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user?.token}`,
          },
        },
      );
      if (!likeResponse.ok) {
        setError(
          new Error(
            `Failed to like the comment. Status: ${likeResponse.status}`,
          ),
        );
      }
      const responseData = await likeResponse.json();
      dispatchProject({
        type: 'UPDATE_PROJECT',
        payload: { project: responseData },
      });

      const comment = project?.comments.find((comment) => comment._id === id);
      setIsCommentLiked(
        comment?.likes.some((like) => like.userId === user?.userId),
      );
    } catch (error) {
      console.error('Error liking the comment:', error);
    }
  };

  useEffect(() => {
    if (project && user) {
      const comment = project.comments.find((comment) => comment._id === id);
      setIsCommentLiked(
        comment?.likes.some((like) => like.userId === user.userId),
      );
    }
  }, [user, project, id]);

  const buttons = [
    {
      icon: user?.userId === authorInfo?._id ? deleteIcon : reportIcon,
      label:
        user?.userId === authorInfo?._id ? 'Delete comment' : 'Report comment',
      onClick:
        user?.userId === authorInfo?._id
          ? handleDeleteComment
          : () => console.log('report comment'),
    },
  ];

  if (
    user?.userId === project?.author._id &&
    user?.userId !== authorInfo?._id
  ) {
    buttons.push({
      icon: deleteIcon,
      label: 'Delete comment',
      onClick: handleDeleteComment,
    });
  }

  return (
    <div className={styles['comment-container']}>
      {isCommentOptionsOpen && (
        <div className={styles['comment-options-container']}>
          <PopOutMenu buttons={buttons} />
        </div>
      )}
      <button
        type="button"
        className={styles['avatar-button']}
        onClick={handleProfileClick}
      >
        <div className={styles['avatar-container']}>
          <img src={authorInfo?.avatarUrl}></img>
        </div>
      </button>
      <div className={styles['comment-details']}>
        <div className={styles['comment-header']}>
          <button
            type="button"
            className={styles['display-name-button']}
            onClick={handleProfileClick}
          >
            <p className={styles['author-display-name']}>
              {authorInfo?.displayName}
            </p>
          </button>
          <p className={styles['comment-timestamp']}>
            {formatDistanceToNowStrict(date)} ago
          </p>
        </div>
        <div className={styles['comment-bottom']}>
          <p className={styles['comment-content']}>
            {isShowingFullComment ? comment : truncatedComment}{' '}
            {comment.length > MAX_COMMENT_LENGTH && (
              <button
                onClick={() => setIsShowingFullComment(!isShowingFullComment)}
                type="button"
                className={styles['expand-comment-button']}
              >
                {isShowingFullComment ? 'show less' : 'show more'}
              </button>
            )}
          </p>

          <div className={styles['comment-actions']}>
            <button
              type="button"
              className={`${styles['like-action-button']} ${isCommentLiked ? styles.liked : ''}`}
              onClick={handleLikeCommentClick}
            >
              {isCommentLiked ? 'Liked' : 'Like'}
            </button>
            <button type="button" className={styles['likes-button']}>
              {likeIcon} {likes.length}
            </button>
          </div>
        </div>
      </div>
      <button
        type="button"
        className={styles['options-button']}
        onClick={() => setIsCommentOptionsOpen(!isCommentOptionsOpen)}
      >
        {moreIcon}
      </button>
    </div>
  );
};

export default Comment;
