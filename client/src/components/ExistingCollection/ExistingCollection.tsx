import { UserType } from '../../context/AuthContext';
import Collection from '../../types/Collection';
import styles from './ExistingCollection.module.scss';
import { useState } from 'react';

interface ExistingCollectionProps {
  title: string;
  numberOfProjects: number;
  collectionId: string;
  isSaved: boolean;
  collections: Collection[];
  setCollections: React.Dispatch<React.SetStateAction<Collection[]>>;
  projectId: string | undefined;
  user: UserType;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const ExistingCollection: React.FC<ExistingCollectionProps> = ({
  title,
  numberOfProjects,
  collectionId,
  isSaved,
  collections,
  setCollections,
  projectId,
  user,
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  const handleToggleInCollection = async (): Promise<void> => {
    setIsLoading(true);
    const toggleCollectionResponse = await fetch(
      `${API_BASE_URL}/collections/${collectionId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({ projectId: projectId }),
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const toggleJson = await toggleCollectionResponse.json();

    if (!toggleCollectionResponse.ok) {
      setError(error);
      setIsLoading(false);
    }

    if (toggleCollectionResponse.ok) {
      setIsLoading(false);

      const index = collections.findIndex(
        (item) => item._id === toggleJson._id,
      );

      if (index !== -1) {
        const updatedCollections = collections.map((item, idx) => {
          if (idx === index) {
            return toggleJson;
          }
          return item;
        });

        setCollections(updatedCollections);
      }
    }
  };

  return (
    <div className={styles.collection}>
      <div className={styles['collection-header']}>
        <h4>{title}</h4>
        <p>
          {numberOfProjects} {numberOfProjects === 1 ? 'Project' : 'Projects'}
        </p>
      </div>
      <button
        className={`${styles['save-button']} ${isSaved ? styles.saved : ''}`}
        onClick={handleToggleInCollection}
      >
        {isLoading ? (
          <span className={styles['loader-spinner']}></span>
        ) : (
          <> {isSaved ? 'Saved' : 'Save'}</>
        )}
      </button>
    </div>
  );
};

export default ExistingCollection;
