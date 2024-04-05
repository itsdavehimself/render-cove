import styles from './MediumUserProfileHeader.module.scss';
import { useUserInfoContext } from '../../../hooks/useUserInfoContext';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUserPlus,
  faUserMinus,
  faCheck,
  faEnvelope,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons';
import handleFollowClick, {
  FollowAction,
} from '../../../containers/UserProfilePublic/UserProfilePublic.utility';
import { useNavigate } from 'react-router-dom';

interface MediumUserProfileHeaderProps {
  setOpenModal: React.Dispatch<React.SetStateAction<string>>;
  followers: number | undefined;
  following: number | undefined;
  isFollowing: boolean;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const MediumUserProfileHeader: React.FC<MediumUserProfileHeaderProps> = ({
  setOpenModal,
  followers,
  following,
  isFollowing,
}) => {
  const { userInfo, dispatchUserInfo } = useUserInfoContext();
  const { user, dispatch } = useAuthContext();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  const [likes, setLikes] = useState<number>(0);
  const [isHoveringFollowButton, setIsHoveringFollowButton] =
    useState<boolean>(false);

  const followIcon: React.ReactNode = <FontAwesomeIcon icon={faUserPlus} />;
  const checkIcon: React.ReactNode = <FontAwesomeIcon icon={faCheck} />;
  const unfollowIcon: React.ReactNode = <FontAwesomeIcon icon={faUserMinus} />;
  const messageIcon: React.ReactNode = <FontAwesomeIcon icon={faEnvelope} />;
  const editProfileIcon: React.ReactNode = <FontAwesomeIcon icon={faUserPen} />;

  useEffect(() => {
    if (userInfo) {
      const totalLikes = userInfo.projects.reduce((total, project) => {
        return total + project?.likes?.length;
      }, 0);
      setLikes(totalLikes);
    }
  }, [userInfo]);

  return (
    <div className={styles['user-info-container']}>
      <div className={styles['user-avatar-container']}>
        <img src={userInfo?.avatarUrl}></img>
      </div>
      <div className={styles['info-container']}>
        <div className={styles['user-basic-info']}>
          <div className={styles['name-tag']}>
            <h3>{userInfo?.displayName}</h3>
            {userInfo?.tagline && (
              <p className={styles['user-tagline']}>{userInfo?.tagline}</p>
            )}
          </div>
          <div>
            {userInfo && (
              <>
                {!user || userInfo.username !== user.username ? (
                  <div className={styles['user-contact-buttons']}>
                    {isFollowing ? (
                      <button
                        className={styles['follower-user-button-unfollow']}
                        onClick={
                          !user
                            ? () => navigate('/login')
                            : () =>
                                handleFollowClick(
                                  FollowAction.Unfollow,
                                  setError,
                                  setIsLoading,
                                  API_BASE_URL,
                                  userInfo._id,
                                  userInfo._id,
                                  user,
                                  dispatch,
                                  dispatchUserInfo,
                                  location.pathname ===
                                    `/user/${userInfo.username}`,
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
                        className={styles['follower-user-button']}
                        onClick={
                          !user
                            ? () => navigate('/login')
                            : () =>
                                handleFollowClick(
                                  FollowAction.Follow,
                                  setError,
                                  setIsLoading,
                                  API_BASE_URL,
                                  userInfo._id,
                                  userInfo._id,
                                  user,
                                  dispatch,
                                  dispatchUserInfo,
                                  location.pathname ===
                                    `/user/${userInfo.username}`,
                                )
                        }
                        disabled={isLoading}
                      >
                        {followIcon} Follow
                      </button>
                    )}
                    <button
                      className={styles['message-user-button']}
                      onClick={() => navigate(`/messages/${userInfo._id}`)}
                    >
                      {messageIcon} Message
                    </button>
                    {error && (
                      <div className={styles['error-message']}>
                        {error.message}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    className={styles['edit-profile-button']}
                    onClick={() => navigate('/profile/edit')}
                  >
                    {editProfileIcon} Edit Profile
                  </button>
                )}
              </>
            )}
          </div>
        </div>
        <div className={styles['user-stats-container']}>
          <div className={styles['user-stats']}>
            <p className={styles['user-stats-number']}>{likes}</p>
            <p className={styles['user-stats-label']}>
              {likes === 1 ? 'LIKE' : 'LIKES'}
            </p>
          </div>
          <button
            className={styles['follow-detail-button']}
            onClick={() => setOpenModal('followers')}
          >
            <div className={styles['user-stats']}>
              <p className={styles['user-stats-number']}>{followers}</p>
              <p className={styles['user-stats-label']}>
                {followers === 1 ? 'FOLLOWER' : 'FOLLOWERS'}
              </p>
            </div>
          </button>
          <button
            className={styles['follow-detail-button']}
            onClick={() => setOpenModal('following')}
          >
            <div className={styles['user-stats']}>
              <p className={styles['user-stats-number']}>{following}</p>
              <p className={styles['user-stats-label']}>FOLLOWING</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MediumUserProfileHeader;
