import styles from './FollowerUser.module.scss';
import { useNavigate } from 'react-router-dom';

interface FollowerUserProps {
  username: string;
  displayName: string;
  avatarUrl: string;
  setOpenModal: React.Dispatch<React.SetStateAction<string>>;
}

const FollowerUser: React.FC<FollowerUserProps> = ({
  username,
  displayName,
  avatarUrl,
  setOpenModal,
}) => {
  const navigate = useNavigate();

  const handleClickUser = () => {
    navigate(`/user/${username}`);
    setOpenModal('none');
  };

  return (
    <div className={styles['follower-card']}>
      <button className={styles['follower-button']} onClick={handleClickUser}>
        <div className={styles['follower-details']}>
          <div className={styles['avatar-container']}>
            <img src={avatarUrl}></img>
          </div>
          <div className={styles['follower-names']}>
            <p className={styles['display-name']}>{displayName}</p>
            <p className={styles.username}>{username}</p>
          </div>
        </div>
      </button>
      <button>Follow</button>
    </div>
  );
};

export default FollowerUser;
