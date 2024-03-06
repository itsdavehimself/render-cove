import styles from './UserProfilePublic.module.scss';
import UserProfileSidebar from '../../components/UserProfile/UserProfileSidebar/UserProfileSidebar';
import { UserInfoContextProvider } from '../../context/UserInfoContext';
import UserProfileMainContent from '../../components/UserProfile/UserProfileMainContent/UserProfileMainContent';

const UserProfilePublic: React.FC = () => {
  return (
    <UserInfoContextProvider>
      <div className={styles['public-profile-container']}>
        <UserProfileMainContent />
        <UserProfileSidebar />
      </div>
    </UserInfoContextProvider>
  );
};

export default UserProfilePublic;
