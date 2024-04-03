import styles from './ThreadCard.module.scss';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { formatDistanceToNowStrict } from 'date-fns';
import { useParams } from 'react-router-dom';

interface ThreadCardProps {
  displayName: string | undefined;
  avatarUrl: string | undefined;
  id: string | undefined;
  lastMessage: string | undefined;
  updatedAt: Date;
  sender: string | undefined;
  unreadCount: number;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  displayName,
  avatarUrl,
  id,
  lastMessage,
  updatedAt,
  sender,
  unreadCount,
}) => {
  const { user } = useAuthContext();
  const { userIdToMessage } = useParams();

  const MAX_PREVIEW_LENGTH = 20;
  const truncatedMessage =
    lastMessage!.length > MAX_PREVIEW_LENGTH
      ? lastMessage?.slice(0, MAX_PREVIEW_LENGTH) + '...'
      : lastMessage;

  return (
    <div
      className={`${styles['thread-card']} ${userIdToMessage === id ? styles.selected : ''}`}
    >
      <div className={styles['thread-main']}>
        <div className={styles['avatar-container']}>
          <img className={styles.avatar} src={avatarUrl}></img>
        </div>
        <div className={styles['message-details']}>
          <p className={`${styles.name} ${unreadCount > 0 ? styles.bold : ''}`}>
            {displayName}
          </p>
          <div className={styles.preview}>
            <div
              className={`${styles['sender-preview']} ${unreadCount > 0 ? styles.bold : ''}`}
            >
              {user?.userId === sender && 'You: '} {truncatedMessage}
            </div>
            <div className={styles.date}>
              • {formatDistanceToNowStrict(updatedAt)} ago
            </div>
          </div>
        </div>
        <div className={styles['dot-container']}>
          {unreadCount > 0 && <div className={styles['unread-dot']}></div>}
        </div>
      </div>
    </div>
  );
};

export default ThreadCard;
