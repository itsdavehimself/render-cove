import styles from './FollowerModal.module.scss';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FollowerUser from '../FollowerUser/FollowerUser';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface FollowerModalProps {
  openModal: string;
  setOpenModal: React.Dispatch<React.SetStateAction<string>>;
}

interface FollowerInfo {
  username: string;
  displayName: string;
  avatarUrl: string;
  _id: string;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const FollowerModal: React.FC<FollowerModalProps> = ({
  openModal,
  setOpenModal,
}) => {
  const { username } = useParams();
  const [userList, setUserList] = useState<FollowerInfo[]>([]);
  const [error, setError] = useState<Error | null>(null);

  const closeIcon: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;

  useEffect(() => {
    if (openModal !== 'none') {
      document.body.classList.add(styles['modal-open']);
    } else {
      document.body.classList.remove(styles['modal-open']);
    }

    return () => {
      document.body.classList.remove(styles['modal-open']);
    };
  }, [openModal]);

  useEffect(() => {
    const fetchUserList = async (): Promise<void> => {
      let usersListResponse;
      if (openModal === 'followers') {
        usersListResponse = await fetch(
          `${API_BASE_URL}/followers/followers/${username}`,
          {
            method: 'GET',
          },
        );
      } else if (openModal === 'following') {
        usersListResponse = await fetch(
          `${API_BASE_URL}/followers/following/${username}`,
          {
            method: 'GET',
          },
        );
      }

      const userListJson = await usersListResponse?.json();

      if (!usersListResponse?.ok) {
        setError(userListJson.error);
      }

      if (usersListResponse?.ok) {
        setUserList(userListJson[openModal]);
      }
    };

    fetchUserList();
  }, [username, openModal]);

  return (
    <>
      <div className={styles['modal-overlay']}></div>
      <div className={styles['modal-container']}>
        <div className={styles['follower-modal']}>
          <div className={styles.header}>
            <h3>{openModal === 'followers' ? 'Followers' : 'Following'}</h3>
            <button
              onClick={() => setOpenModal('none')}
              className={styles['close-button']}
            >
              {closeIcon}
            </button>
          </div>
          {userList.map((follower) => (
            <FollowerUser
              username={follower?.username}
              displayName={follower?.displayName}
              avatarUrl={follower?.avatarUrl}
              key={follower?._id}
              setOpenModal={setOpenModal}
            />
          ))}
        </div>
      </div>
    </>
  );
};

export default FollowerModal;
