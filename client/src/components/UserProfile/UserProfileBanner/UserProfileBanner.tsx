import styles from './UserProfileBanner.module.scss';

interface UserProfileBannerProps {
  bannerUrl: string | undefined;
}

const UserProfileBanner: React.FC<UserProfileBannerProps> = ({ bannerUrl }) => {
  return (
    <header className={styles['user-banner-container']}>
      <img src={bannerUrl}></img>
    </header>
  );
};

export default UserProfileBanner;
