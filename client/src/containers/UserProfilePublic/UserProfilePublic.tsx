import styles from './UserProfilePublic.module.scss';
import UserProfileSidebar from '../../components/UserProfile/UserProfileSidebar/UserProfileSidebar';
import { UserInfoContextProvider } from '../../context/UserInfoContext';
import UserProfileMainContent from '../../components/UserProfile/UserProfileMainContent/UserProfileMainContent';
import { AllProjectsContextProvider } from '../../context/AllProjectsContext';

const UserProfilePublic: React.FC = () => {
  return (
    <UserInfoContextProvider>
      <div className={styles['public-profile-container']}>
        <main className={styles.main}>
          <AllProjectsContextProvider>
            <UserProfileMainContent />
          </AllProjectsContextProvider>
        </main>
        <aside className={styles.sidebar}>
          <UserProfileSidebar />
        </aside>
      </div>
    </UserInfoContextProvider>
  );
};

export default UserProfilePublic;
