import styles from './UserCollections.module.scss';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserLikes: React.FC = () => {
  const { user } = useAuthContext();
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [collections, setCollections] = useState();
  const { username } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (username !== user.username) {
      navigate(`/${user.username}/likes`);
    }

    const fetchCollections = async (): Promise<void> => {
      setError(null);
      const collectionsResponse = await fetch(`${API_BASE_URL}/collections/`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      const collectionsJson = await collectionsResponse.json();

      if (!collectionsResponse.ok) {
        setIsLoading(false);
        setError(collectionsJson.error);
      }

      if (collectionsResponse.ok) {
        setIsLoading(false);
        setCollections(collectionsJson);
      }
    };

    fetchCollections();
  }, [user.token, navigate, user.username, username]);

  return (
    <main className={styles['collections-container']}>
      <div className={styles.header}>
        <h1>Collections</h1>
        <p>See all of your collections here</p>
      </div>
      {isLoading ? (
        <div>Loading</div>
      ) : (
        <>
          {error ? (
            <div>
              There was an error loading the posts. Please try again in a little
              bit.
            </div>
          ) : (
            <div>Much empty</div>
          )}
        </>
      )}
    </main>
  );
};

export default UserLikes;
