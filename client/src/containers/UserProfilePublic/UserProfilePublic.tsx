import styles from './UserProfilePublic.module.scss';
import UserProfileSidebar from '../../components/UserProfile/UserProfileSidebar/UserProfileSidebar';
import { UserInfoContextProvider } from '../../context/UserInfoContext';
import UserProfileMainContent from '../../components/UserProfile/UserProfileMainContent/UserProfileMainContent';
import { AllProjectsContextProvider } from '../../context/AllProjectsContext';
import { CollectionsContextProvider } from '../../context/CollectionsContext';

const UserProfilePublic: React.FC = () => {
  return (
    <UserInfoContextProvider>
      <div className={styles['public-profile-container']}>
        <main className={styles.main}>
          <CollectionsContextProvider>
            <AllProjectsContextProvider>
              <UserProfileMainContent />
            </AllProjectsContextProvider>
          </CollectionsContextProvider>
        </main>
        <aside className={styles.sidebar}>
          <UserProfileSidebar />
        </aside>
      </div>
    </UserInfoContextProvider>
  );
};

export default UserProfilePublic;
