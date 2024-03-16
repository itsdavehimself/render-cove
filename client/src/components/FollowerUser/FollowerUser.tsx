import styles from './FollowerUser.module.scss';

interface FollowerUserProps {
  username: string;
  displayName: string;
  avatarUrl: string;
  _id: string;
}

const FollowerUser: React.FC<FollowerUserProps> = ({
  username,
  displayName,
  avatarUrl,
  _id,
}) => {
  return (
    <div className={styles['follower-card']}>
      <div className={styles['follower-details']}>
        <div className={styles['avatar-container']}>
          <img src={avatarUrl}></img>
        </div>
        <div className={styles['follower-names']}>
          <p className={styles['display-name']}>{displayName}</p>
          <p className={styles.username}>{username}</p>
        </div>
      </div>
      <button>Follow</button>
    </div>
  );
};

export default FollowerUser;
