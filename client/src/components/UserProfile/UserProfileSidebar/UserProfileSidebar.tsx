import styles from './UserProfileSidebar.module.scss';
import UserInfo from '../../../types/UserInfo';
import { formatDate } from '../../../utility/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import {
  faLocationDot,
  faGlobe,
  faUserPlus,
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

interface UserProfileSidebarProps {
  userInfo: UserInfo | null;
  username: string | undefined;
}

const UserProfileSidebar: React.FC<UserProfileSidebarProps> = ({
  userInfo,
  username,
}) => {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const locationIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faLocationDot} />
  );
  const websiteIcon: React.ReactNode = <FontAwesomeIcon icon={faGlobe} />;
  const addUserIcon: React.ReactNode = <FontAwesomeIcon icon={faUserPlus} />;
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
        {username !== user.username ? (
          <div className={styles['user-contact-buttons']}>
            <button className={styles['follower-user-button']}>
              {addUserIcon} Follow
            </button>
            <button className={styles['message-user-button']}>
              {messageIcon} Message
            </button>
          </div>
        ) : (
          <button
            className={styles['edit-profile-button']}
            onClick={() => navigate('/profile/edit')}
          >
            {editProfileIcon} Edit Profile
          </button>
        )}
        {userInfo?.socials && userInfo.socials.length > 0 && (
          <div className={styles['user-social-container']}>
            <h4 className={styles['user-section-header']}>Social</h4>
            <div className={styles['user-social-icons']}>
              {userInfo.socials.map(
                (social) =>
                  social.username && (
                    <div className={styles['social-icon']} key={social._id}>
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
        {userInfo?.software && userInfo.software.length > 0 && (
          <div className={styles['user-tools-software']}>
            <h4 className={styles['user-section-header']}>Tools & Software</h4>
            <div className={styles['software-container']}>
              {userInfo.software.map((softwareItem) => (
                <div className={styles['software-item']}>{softwareItem}</div>
              ))}
            </div>
          </div>
        )}
        {userInfo?.generators && userInfo?.generators.length > 0 && (
          <div className={styles['user-tools-software']}>
            <h4 className={styles['user-section-header']}>Generators & UI</h4>
            <div className={styles['software-container']}>
              {userInfo?.generators.map((generatorItem) => (
                <div className={styles['software-item']}>{generatorItem}</div>
              ))}
            </div>
          </div>
        )}
        <div className={styles['user-stats-container']}>
          <div className={styles['user-stats']}>
            <p className={styles['user-stats-number']}>0</p>
            <p className={styles['user-stats-label']}>LIKES</p>
          </div>
          <div className={styles['user-stats']}>
            <p className={styles['user-stats-number']}>0</p>
            <p className={styles['user-stats-label']}>FOLLOWERS</p>
          </div>
          <div className={styles['user-stats']}>
            <p className={styles['user-stats-number']}>0</p>
            <p className={styles['user-stats-label']}>FOLLOWING</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default UserProfileSidebar;
