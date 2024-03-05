import styles from './UserProfilePublic.module.scss';
import UserProfileSidebar from '../../components/UserProfile/UserProfileSidebar/UserProfileSidebar';
import { UserInfoContextProvider } from '../../context/UserInfoContext';
import UserProfileMainContent from '../../components/UserProfile/UserProfileMainContent/UserProfileMainContent';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserProfilePublic: React.FC = () => {
  return (
    <UserInfoContextProvider>
      <div className={styles['public-profile-container']}>
        <UserProfileMainContent />
        <UserProfileSidebar API_BASE_URL={API_BASE_URL} />
      </div>
    </UserInfoContextProvider>
  );
};

export default UserProfilePublic;
