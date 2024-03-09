import styles from './Comment.module.scss';
import { Like } from '../../types/Project';
import { useState, useEffect } from 'react';
import UserInfo from '../../types/UserInfo';
import { formatDistanceToNowStrict } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp } from '@fortawesome/free-solid-svg-icons';

interface CommentProps {
  author: string;
  comment: string;
  date: Date;
  likes: Like[];
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const Comment: React.FC<CommentProps> = ({ author, comment, date, likes }) => {
  const [authorInfo, setAuthorInfo] = useState<UserInfo | undefined>();
  const [error, setError] = useState<Error | null>(null);

  const likeIcon: React.ReactNode = <FontAwesomeIcon icon={faThumbsUp} />;

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
  return (
    <div className={styles['comment-container']}>
      <div className={styles['avatar-container']}>
        <img src={authorInfo?.avatarUrl}></img>
      </div>
      <div className={styles['comment-details']}>
        <div className={styles['comment-header']}>
          <p className={styles['author-display-name']}>
            {authorInfo?.displayName}
          </p>
          <p className={styles['comment-timestamp']}>
            {formatDistanceToNowStrict(date)} ago
          </p>
        </div>
        <div className={styles['comment-bottom']}>
          <p className={styles['comment-content']}>{comment}</p>
          <div className={styles['comment-actions']}>
            <button className={styles['like-action-button']}>Like</button>
            <button className={styles['likes-button']}>
              {likeIcon} {likes.length}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comment;
