import styles from './ThreadCard.module.scss';

interface ThreadCardProps {
  displayName: string;
  avatarUrl: string;
}

const ThreadCard: React.FC<ThreadCardProps> = ({ displayName, avatarUrl }) => {
  return (
    <div className={styles['thread-card']}>
      <div className={styles['avatar-container']}>
        <img className={styles.avatar} src={avatarUrl}></img>
      </div>
      <p className={styles.name}>{displayName}</p>
    </div>
  );
};

export default ThreadCard;
