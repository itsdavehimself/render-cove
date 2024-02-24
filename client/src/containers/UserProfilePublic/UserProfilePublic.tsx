import styles from './UserProfilePublic.module.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Outlet } from 'react-router-dom';
import UserProfileSidebar from '../../components/UserProfile/UserProfileSidebar/UserProfileSidebar';
import UserInfo from '../../types/UserInfo';
import UserProfileBanner from '../../components/UserProfile/UserProfileBanner/UserProfileBanner';
import UserProfileNavbar from '../../components/UserProfile/UserProfileNavbar/UserProfileNavbar';

interface UserProfilePublicProps {}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserProfilePublic: React.FC<UserProfilePublicProps> = () => {
  const { username } = useParams();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);

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
      <section className={styles['profile-main-content']}>
        {userInfo?.bannerUrl && (
          <UserProfileBanner bannerUrl={userInfo.bannerUrl} />
        )}
        <UserProfileNavbar username={username} />
        <Outlet />
      </section>
      <UserProfileSidebar userInfo={userInfo} />
    </div>
  );
};

export default UserProfilePublic;
