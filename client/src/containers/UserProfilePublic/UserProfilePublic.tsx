import styles from './UserProfilePublic.module.scss';
import UserProfileSidebar from '../../components/UserProfile/UserProfileSidebar/UserProfileSidebar';
import UserProfileMainContent from '../../components/UserProfile/UserProfileMainContent/UserProfileMainContent';
import { AllProjectsContextProvider } from '../../context/AllProjectsContext';
import { CollectionsContextProvider } from '../../context/CollectionsContext';
import { useState, useEffect } from 'react';
import FollowerModal from '../../components/FollowerModal/FollowerModal';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useUserInfoContext } from '../../hooks/useUserInfoContext';

const UserProfilePublic: React.FC = () => {
  const { user } = useAuthContext();
  const { userInfo } = useUserInfoContext();
  const [openModal, setOpenModal] = useState<string>('none');
  const [followers, setFollowers] = useState<number | undefined>(
    userInfo?.followers.length || 0,
  );
  const [following, setFollowing] = useState<number | undefined>(
    userInfo?.following.length || 0,
  );
  const [isFollowing, setIsFollowing] = useState<boolean>(false);

  useEffect(() => {
    if (userInfo && userInfo._id !== user.userId) {
      setFollowers(userInfo.followers.length);
      setFollowing(userInfo.following.length);
    } else if (userInfo && userInfo._id === user.userId) {
      setFollowers(user.followers.length);
      setFollowing(user.following.length);
    }
  }, [userInfo, user]);

  useEffect(() => {
    if (user && userInfo && userInfo.followers) {
      setIsFollowing(userInfo.followers.includes(user.userId));
    }
  }, [user, userInfo]);

  return (
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
          <UserProfileSidebar
            setOpenModal={setOpenModal}
            followers={followers}
            following={following}
            isFollowing={isFollowing}
          />
        </aside>
      </div>
    </>
  );
};

export default UserProfilePublic;
