import styles from './UserProfilePublic.module.scss';
import UserProfileSidebar from '../../components/UserProfile/UserProfileSidebar/UserProfileSidebar';
import { UserInfoContextProvider } from '../../context/UserInfoContext';
import UserProfileMainContent from '../../components/UserProfile/UserProfileMainContent/UserProfileMainContent';
import { AllProjectsContextProvider } from '../../context/AllProjectsContext';
import { CollectionsContextProvider } from '../../context/CollectionsContext';
import { useState } from 'react';
import FollowerModal from '../../components/FollowerModal/FollowerModal';

const UserProfilePublic: React.FC = () => {
  const [openModal, setOpenModal] = useState<string>('none');

  return (
    <UserInfoContextProvider>
      <>
        {openModal !== 'none' && (
          <FollowerModal openModal={openModal} setOpenModal={setOpenModal} />
        )}
        <div className={styles['public-profile-container']}>
          <main className={styles.main}>
            <CollectionsContextProvider>
              <AllProjectsContextProvider>
                <UserProfileMainContent />
              </AllProjectsContextProvider>
            </CollectionsContextProvider>
          </main>
          <aside className={styles.sidebar}>
            <UserProfileSidebar setOpenModal={setOpenModal} />
          </aside>
        </div>
      </>
    </UserInfoContextProvider>
  );
};

export default UserProfilePublic;
