import styles from './UserCard.module.scss';
import { UserCardInfo } from '../../containers/Search/Search';
import { useNavigate } from 'react-router-dom';

interface UserCardProps {
  userForCard: UserCardInfo;
}

const UserCard: React.FC<UserCardProps> = ({ userForCard }) => {
  const navigate = useNavigate();

  return (
    <div
      className={styles['user-card']}
      onClick={() => navigate(`/user/${userForCard.username}`)}
    >
      <div className={styles['user-info']}>
        <div className={styles['avatar-container']}>
          <img src={userForCard.avatarUrl}></img>
        </div>
        <div>
          <p className={styles['display-name']}>{userForCard.displayName}</p>
          <p className={styles['small-info']}>{userForCard.tagline}</p>
          <p className={styles['small-info']}>
            {userForCard.followers.length} followers
          </p>
        </div>
      </div>
      <button className={styles['view-profile-button']}>View Profile</button>
    </div>
  );
};

export default UserCard;
