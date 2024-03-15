import styles from './UserCollections.module.scss';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CollectionCard from '../../components/CollectionCard/CollectionCard';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import EditCollectionModal from '../../components/EditCollectionModal/EditCollectionModal';
import { useCollectionsContext } from '../../hooks/useCollectionsContext';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserLikes: React.FC = () => {
  const { user } = useAuthContext();
  const { collections } = useCollectionsContext();
  const { username } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [collectionToDelete, setCollectionToDelete] = useState<string>('');

  useEffect(() => {
    if (username !== user.username) {
      navigate(`/${user.username}/collections`);
    }
  }, [user]);

  const handleDeleteCollection = async (): Promise<void> => {
    const deleteCollectionResponse = await fetch(
      `${API_BASE_URL}/collections/${collectionToDelete}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const deleteCollectionJson = await deleteCollectionResponse.json();

    if (!deleteCollectionResponse.ok) {
      setError(deleteCollectionJson.error);
      setIsLoading(false);
    }

    if (deleteCollectionResponse.ok) {
      setIsLoading(false);
    }
  };

  return (
    <main className={styles['collections-container']}>
      {isDeleteModalOpen && (
        <DeleteModal
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
          handleDeleteClick={handleDeleteCollection}
          isLoading={isLoading}
          type="collection"
        />
      )}
      {isEditModalOpen && <EditCollectionModal />}
      <div className={styles.header}>
        <h1>Collections</h1>
        <p>See all of your collections here</p>
      </div>
      <>
        {error ? (
          <div>
            There was an error loading the posts. Please try again in a little
            bit.
          </div>
        ) : (
          <section className={styles['collection-cards']}>
            {collections?.map((collection) => (
              <CollectionCard
                title={collection.title}
                creator={collection.creator}
                collectionId={collection._id}
                isPrivate={collection.private}
                imageUrl={collection.projects[0]?.images[0]?.url}
                key={collection._id}
                setIsDeleteModalOpen={setIsDeleteModalOpen}
                setIsEditModalOpen={setIsEditModalOpen}
                setCollectionToDelete={setCollectionToDelete}
              />
            ))}
          </section>
        )}
      </>
    </main>
  );
};

export default UserLikes;
