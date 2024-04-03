import styles from './FollowerUser.module.scss';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useState, useEffect } from 'react';
import { useUserInfoContext } from '../../hooks/useUserInfoContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faUserMinus,
  faCheck,
} from '@fortawesome/free-solid-svg-icons';
import handleFollowClick, {
  FollowAction,
} from '../../containers/UserProfilePublic/UserProfilePublic.utility';
import ErrorAlert from '../ErrorAlert/ErrorAlert';

interface FollowerUserProps {
  username: string;
  displayName: string;
  avatarUrl: string;
  setOpenModal: React.Dispatch<React.SetStateAction<string>>;
  _id: string;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const FollowerUser: React.FC<FollowerUserProps> = ({
  username,
  displayName,
  avatarUrl,
  setOpenModal,
  _id,
}) => {
  const navigate = useNavigate();
  const { user, dispatch } = useAuthContext();
  const { userInfo, dispatchUserInfo } = useUserInfoContext();
  const [error, setError] = useState<Error | null>(new Error());
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isHoveringFollowButton, setIsHoveringFollowButton] =
    useState<boolean>(false);

  const followIcon: React.ReactNode = <FontAwesomeIcon icon={faUserPlus} />;
  const checkIcon: React.ReactNode = <FontAwesomeIcon icon={faCheck} />;
  const unfollowIcon: React.ReactNode = <FontAwesomeIcon icon={faUserMinus} />;

  const handleClickUser = () => {
    navigate(`/user/${username}`);
    setOpenModal('none');
  };

  useEffect(() => {
    if (user && userInfo && userInfo.followers) {
      setIsFollowing(user.following.includes(_id));
    }
  }, [user, userInfo, _id]);

  return (
    <>
      <div className={styles['error-container']}>{error && <ErrorAlert />}</div>
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
        {user.userId !== _id ? (
          <>
            {isFollowing ? (
              <button
                className={styles['unfollow-button']}
                onClick={
                  !user
                    ? () => navigate('/login')
                    : () =>
                        handleFollowClick(
                          FollowAction.Unfollow,
                          setError,
                          setIsLoading,
                          API_BASE_URL,
                          userInfo?._id,
                          _id,
                          user,
                          dispatch,
                          dispatchUserInfo,
                          location.pathname === `/user/${userInfo?.username}`,
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
                className={styles['follow-button']}
                onClick={
                  !user
                    ? () => navigate('/login')
                    : () =>
                        handleFollowClick(
                          FollowAction.Follow,
                          setError,
                          setIsLoading,
                          API_BASE_URL,
                          userInfo?._id,
                          _id,
                          user,
                          dispatch,
                          dispatchUserInfo,
                          location.pathname === `/user/${userInfo?.username}`,
                        )
                }
                disabled={isLoading}
              >
                {followIcon} Follow
              </button>
            )}
          </>
        ) : (
          ''
        )}
      </div>
    </>
  );
};

export default FollowerUser;
