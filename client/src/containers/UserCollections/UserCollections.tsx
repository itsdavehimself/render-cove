import styles from './UserCollections.module.scss';
import { useEffect, useState } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import CollectionCard from '../../components/CollectionCard/CollectionCard';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import EditCollectionModal from '../../components/EditCollectionModal/EditCollectionModal';
import { useCollectionsContext } from '../../hooks/useCollectionsContext';
import EditAlert from '../../components/EditAlert/EditAlert';
import LargeLoadingSpinner from '../../components/LargeLoadingSpinner/LargeLoadingSpinner';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

export interface FocusedCollectionType {
  title: string;
  creator: string;
  isPrivate: boolean;
  collectionId: string;
}

const UserLikes: React.FC = () => {
  const { user } = useAuthContext();
  const { collections, dispatchCollections, isLoadingCollections } =
    useCollectionsContext();
  const { username } = useParams();
  const navigate = useNavigate();

  const [error, setError] = useState<Error | null>(null);
  const [emptyNameError, setEmptyNameError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [focusedCollection, setFocusedCollection] = useState<
    FocusedCollectionType | undefined
  >(undefined);
  const [isShowingAlert, setIsShowingAlert] = useState<boolean>(false);

  useEffect(() => {
    if (username !== user.username) {
      navigate(`/${user.username}/collections`);
    }
  }, [user]);

  const handleDeleteCollection = async (): Promise<void> => {
    setIsLoading(true);
    const deleteCollectionResponse = await fetch(
      `${API_BASE_URL}/collections/${focusedCollection?.collectionId}`,
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
      setIsDeleteModalOpen(false);
      dispatchCollections({
        type: 'GET_COLLECTIONS',
        payload: deleteCollectionJson,
      });
      setFocusedCollection(undefined);
    }
  };

  const handleEditCollection = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setEmptyNameError(null);
    const updatedCollectionString = JSON.stringify(focusedCollection);

    const editCollectionResponse = await fetch(
      `${API_BASE_URL}/collections/update/${focusedCollection?.collectionId}`,
      {
        method: 'PATCH',
        body: updatedCollectionString,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const editCollectionJson = await editCollectionResponse.json();

    if (!editCollectionResponse.ok) {
      setIsLoading(false);
      if (editCollectionJson.error === 'Empty collection name') {
        setEmptyNameError(editCollectionJson.error);
      } else {
        setIsShowingAlert(true);
        setError(editCollectionJson.error);
        setIsEditModalOpen(false);
      }
    }

    if (editCollectionResponse.ok) {
      setIsLoading(false);
      setIsEditModalOpen(false);
      dispatchCollections({
        type: 'GET_COLLECTIONS',
        payload: editCollectionJson,
      });
      setFocusedCollection(undefined);
      setIsShowingAlert(true);
    }

    setTimeout(() => {
      setIsShowingAlert(false);
    }, 4000);
  };

  return (
    <>
      <div className={styles['alert-container']}>
        {isShowingAlert && (
          <EditAlert isSuccess={error === null} itemToUpdate="Collection" />
        )}
      </div>
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
        {isEditModalOpen && (
          <EditCollectionModal
            isModalOpen={isEditModalOpen}
            setIsModalOpen={setIsEditModalOpen}
            handleEditClick={handleEditCollection}
            isLoading={isLoading}
            focusedCollection={focusedCollection}
            setFocusedCollection={setFocusedCollection}
            error={emptyNameError}
          />
        )}
        <div className={styles.header}>
          <h1>Collections</h1>
          <p>See all of your collections here</p>
        </div>
        <>
          {isLoadingCollections ? (
            <LargeLoadingSpinner />
          ) : (
            <>
              {error ? (
                <div>
                  There was an error loading the posts. Please try again in a
                  little bit.
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
                      setFocusedCollection={setFocusedCollection}
                    />
                  ))}
                </section>
              )}
            </>
          )}
        </>
      </main>
    </>
  );
};

export default UserLikes;
