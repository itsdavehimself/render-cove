import styles from './UserProfileSidebar.module.scss';
import { formatDate } from '../../../utility/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faLocationDot,
  faGlobe,
  faUserPlus,
  faUserMinus,
  faCheck,
  faEnvelope,
  faUserPen,
} from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
  faGithub,
  faBehance,
} from '@fortawesome/free-brands-svg-icons';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useUserInfoContext } from '../../../hooks/useUserInfoContext';
import TagDisplay from '../../TagDisplay/TagDisplay';
import handleFollowClick, {
  FollowAction,
} from '../../../containers/UserProfilePublic/UserProfilePublic.utility';

interface UserProfileSidebarProps {
  setOpenModal: React.Dispatch<React.SetStateAction<string>>;
  followers: number | undefined;
  following: number | undefined;
  isFollowing: boolean;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({
  setOpenModal,
  followers,
  following,
  isFollowing,
}) => {
  const navigate = useNavigate();
  const { userInfo, dispatchUserInfo } = useUserInfoContext();
  const { user, dispatch } = useAuthContext();
  const [isHoveringFollowButton, setIsHoveringFollowButton] =
    useState<boolean>(false);
  const [likes, setLikes] = useState<number>(0);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const locationIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faLocationDot} />
  );
  const websiteIcon: React.ReactNode = <FontAwesomeIcon icon={faGlobe} />;
  const followIcon: React.ReactNode = <FontAwesomeIcon icon={faUserPlus} />;
  const checkIcon: React.ReactNode = <FontAwesomeIcon icon={faCheck} />;
  const unfollowIcon: React.ReactNode = <FontAwesomeIcon icon={faUserMinus} />;
  const messageIcon: React.ReactNode = <FontAwesomeIcon icon={faEnvelope} />;
  const editProfileIcon: React.ReactNode = <FontAwesomeIcon icon={faUserPen} />;

  const networkIcons: Record<string, IconProp> = {
    facebook: faFacebook,
    instagram: faInstagram,
    x: faXTwitter,
    youtube: faYoutube,
    github: faGithub,
    behance: faBehance,
  };

  const networkUrls: Record<string, string> = {
    facebook: 'https://www.facebook.com/',
    instagram: 'https://www.instagram.com/',
    x: 'https://www.x.com/',
    youtube: 'https://www.youtube.com/@',
    github: 'https://www.github.com/',
    behance: 'https://www.behance.net/',
  };

  useEffect(() => {
    if (userInfo) {
      const totalLikes = userInfo.projects.reduce((total, project) => {
        return total + project?.likes?.length;
      }, 0);
      setLikes(totalLikes);
    }
  }, [userInfo]);

  return (
    <aside className={styles['profile-sidebar-container']}>
      <div className={styles['profile-sidebar']}>
        <div className={styles['user-overview']}>
          <div className={styles['user-avatar-container']}>
            <img src={userInfo?.avatarUrl}></img>
          </div>
          <div className={styles['user-basic-info']}>
            <h3>{userInfo?.displayName}</h3>
            {userInfo?.tagline && (
              <p className={styles['user-tagline']}>{userInfo?.tagline}</p>
            )}
          </div>
        </div>
        <div className={styles['user-location-website']}>
          {userInfo?.location && (
            <div className={styles['location-details']}>
              <span className={styles['location-icon']}>{locationIcon}</span>{' '}
              {userInfo?.location}
            </div>
          )}
          {userInfo?.website && (
            <div className={styles['location-details']}>
              <span className={styles['location-icon']}>{websiteIcon}</span>{' '}
              <a
                className={styles['user-website']}
                href={
                  userInfo?.website.startsWith('http')
                    ? userInfo?.website
                    : `https://${userInfo?.website}`
                }
                target="_blank"
                rel="noopener noreferrer"
              >
                {userInfo?.website}
              </a>
            </div>
          )}
        </div>
        {userInfo?.summary && (
          <div className={styles['user-bio']}>{userInfo?.summary}</div>
        )}
        <p className={styles['user-joined-info']}>
          Joined{' '}
          {userInfo?.createdAt && formatDate(userInfo?.createdAt as Date)}
        </p>
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
                  <div className={styles['error-message']}>{error.message}</div>
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

        {userInfo?.socials && userInfo.socials.length > 0 && (
          <div className={styles['user-social-container']}>
            <h4 className={styles['user-section-header']}>Social</h4>
            <div className={styles['user-social-icons']}>
              {userInfo.socials.map(
                (social, index) =>
                  social.username && (
                    <div className={styles['social-icon']} key={index}>
                      <a
                        href={`${networkUrls[social.network]}${social.username}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <FontAwesomeIcon icon={networkIcons[social.network]} />
                      </a>
                    </div>
                  ),
              )}
            </div>
          </div>
        )}
        <TagDisplay header="Tools & Software" tagList={userInfo?.software} />
        <TagDisplay header="Generators & UI" tagList={userInfo?.generators} />
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
    </aside>
  );
};

export default UserProfileSidebar;
