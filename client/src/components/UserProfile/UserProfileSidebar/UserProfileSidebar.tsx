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
import { useState, useEffect } from 'react';
import { useUserInfoContext } from '../../../hooks/useUserInfoContext';
import TagDisplay from '../../TagDisplay/TagDisplay';

enum FollowAction {
  Follow = 'follow',
  Unfollow = 'unfollow',
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserProfileSidebar: React.FC = () => {
  const { user, dispatch } = useAuthContext();
  const { userInfo, dispatchUserInfo } = useUserInfoContext();
  const navigate = useNavigate();

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [followers, setFollowers] = useState<number | undefined>(
    userInfo?.followers.length || 0,
  );
  const [following, setFollowing] = useState<number | undefined>(
    userInfo?.following.length || 0,
  );
  const [isHoveringFollowButton, setIsHoveringFollowButton] =
    useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

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

  const handleFollowClick = async (action: FollowAction): Promise<void> => {
    setError(null);
    setIsLoading(true);
    const toggleFollowStatusResponse = await fetch(
      `${API_BASE_URL}/users/toggleFollowStatus/${userInfo?._id}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          followAction: action,
        }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const toggleFollowStatusJSON = await toggleFollowStatusResponse.json();

    if (!toggleFollowStatusResponse.ok) {
      setError(toggleFollowStatusJSON);
      setIsLoading(false);
    }

    if (toggleFollowStatusResponse.ok) {
      setError(null);
      setIsLoading(false);

      const mergedUser = { ...user, ...toggleFollowStatusJSON.updatedUser };

      setFollowers(toggleFollowStatusJSON.toggledUser.followers.length);
      dispatchUserInfo({
        type: 'UPDATE_INFO',
        payload: toggleFollowStatusJSON.toggledUser,
      });
      setIsFollowing(userInfo.followers.includes(user.userId));
      dispatch({ type: 'UPDATE_USER', payload: mergedUser });
      localStorage.setItem('user', JSON.stringify(mergedUser));
    }
  };

  useEffect(() => {
    if (userInfo) {
      setFollowers(userInfo.followers.length);
      setFollowing(userInfo.following.length);
    }
  }, [userInfo]);

  useEffect(() => {
    if (user && userInfo && userInfo.followers) {
      setIsFollowing(userInfo.followers.includes(user.userId));
    }
  }, [user, userInfo]);

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
                        : () => handleFollowClick(FollowAction.Unfollow)
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
                        : () => handleFollowClick(FollowAction.Follow)
                    }
                    disabled={isLoading}
                  >
                    {followIcon} Follow
                  </button>
                )}
                <button className={styles['message-user-button']}>
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
            <p className={styles['user-stats-number']}>0</p>
            <p className={styles['user-stats-label']}>LIKES</p>
          </div>
          <div className={styles['user-stats']}>
            <p className={styles['user-stats-number']}>{followers}</p>
            <p className={styles['user-stats-label']}>FOLLOWERS</p>
          </div>
          <div className={styles['user-stats']}>
            <p className={styles['user-stats-number']}>{following}</p>
            <p className={styles['user-stats-label']}>FOLLOWING</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserProfileSidebar;
