import styles from './UserProfileMainContent.module.scss';
import UserProfileBanner from '../UserProfileBanner/UserProfileBanner';
import UserProfileNavbar from '../UserProfileNavbar/UserProfileNavbar';
import { Outlet } from 'react-router-dom';
import { useUserInfoContext } from '../../../hooks/useUserInfoContext';

const UserProfileMainContent: React.FC = () => {
  const { userInfo } = useUserInfoContext();
  return (
    <section className={styles['profile-main-content']}>
      {userInfo?.bannerUrl && (
        <UserProfileBanner bannerUrl={userInfo.bannerUrl} />
      )}
      <UserProfileNavbar username={userInfo && userInfo.username} />
      <Outlet />
    </section>
  );
};

export default UserProfileMainContent;
