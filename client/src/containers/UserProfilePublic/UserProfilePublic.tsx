import styles from './UserProfilePublic.module.scss';
import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import UserProfileSidebar from '../../components/UserProfileSidebar/UserProfileSidebar';
import UserInfo from '../../types/UserInfo';

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
      <UserProfileSidebar userInfo={userInfo} />
      <section className={styles['profile-main-content']}></section>
    </div>
  );
};

export default UserProfilePublic;
