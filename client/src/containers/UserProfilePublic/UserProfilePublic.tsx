import styles from './UserProfilePublic.module.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { formatDate } from '../../utility/FormatDate';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faLocationDot, faGlobe } from '@fortawesome/free-solid-svg-icons';
import {
  faFacebook,
  faInstagram,
  faXTwitter,
  faYoutube,
  faGithub,
  faBehance,
} from '@fortawesome/free-brands-svg-icons';

interface UserProfilePublicProps {}

interface UserInfo {
  email: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  summary: string;
  generators: string[];
  software: string[];
  socials: {
    network: string;
    username: string;
    _id: string;
  }[];
  location: string;
  tagline: string;
  website: string;
  createdAt: Date;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserProfilePublic: React.FC<UserProfilePublicProps> = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

  const locationIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faLocationDot} />
  );

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

  const websiteIcon: React.ReactNode = <FontAwesomeIcon icon={faGlobe} />;

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      try {
        const userInfoResponse = await fetch(
          `${API_BASE_URL}/users/${username}`,
          {
            method: 'GET',
          },
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          setUserInfo(userInfo);
        } else {
          console.error(userInfoResponse.json());
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, [username]);

  return (
    <div className={styles['public-profile-container']}>
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
          <button>Follow</button>
          <button>Message</button>
          <div>
            <div>Socials</div>
            {userInfo?.socials && userInfo.socials.length > 0 && (
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
                          <FontAwesomeIcon
                            icon={networkIcons[social.network]}
                          />
                        </a>
                      </div>
                    ),
                )}
              </div>
            )}
          </div>
        </div>
      </aside>
      <section className={styles['profile-main-content']}></section>
    </div>
  );
};

export default UserProfilePublic;
