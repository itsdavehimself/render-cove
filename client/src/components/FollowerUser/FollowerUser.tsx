import styles from './FollowerUser.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

interface FollowerUserProps {
  username: string;
  displayName: string;
  avatarUrl: string;
  setOpenModal: React.Dispatch<React.SetStateAction<string>>;
  _id: string;
}

const FollowerUser: React.FC<FollowerUserProps> = ({
  username,
  displayName,
  avatarUrl,
  setOpenModal,
  _id,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();

  const handleClickUser = () => {
    navigate(`/user/${username}`);
    setOpenModal('none');
  };

  return (
    <div className={styles['follower-card']}>
      <button
        className={styles['user-profile-button']}
        onClick={handleClickUser}
      >
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
      <button className={styles['follow-button']}>Follow</button>
    </div>
  );
};

export default FollowerUser;
