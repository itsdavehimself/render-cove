import styles from './ThreadCard.module.scss';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { formatDistanceToNowStrict } from 'date-fns';

interface ThreadCardProps {
  displayName: string;
  avatarUrl: string;
  lastMessage: string;
  updatedAt: Date;
  sender: string;
  unreadCount: number;
}

const ThreadCard: React.FC<ThreadCardProps> = ({
  displayName,
  avatarUrl,
  lastMessage,
  updatedAt,
  sender,
  unreadCount,
}) => {
  const { user } = useAuthContext();

  return (
    <div className={styles['thread-card']}>
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
              {user.userId === sender && 'You: '} {lastMessage}
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
