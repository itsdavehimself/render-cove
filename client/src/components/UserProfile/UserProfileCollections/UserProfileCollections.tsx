import styles from './UserProfileCollections.module.scss';
import { useCollectionsContext } from '../../../hooks/useCollectionsContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useUserInfoContext } from '../../../hooks/useUserInfoContext';
import CollectionCard from '../../CollectionCard/CollectionCard';
import React from 'react';
import { useState } from 'react';
import DeleteModal from '../../DeleteModal/DeleteModal';
import EditCollectionModal from '../../EditCollectionModal/EditCollectionModal';
import { FocusedCollectionType } from '../../../containers/UserCollections/UserCollections';
import EditAlert from '../../EditAlert/EditAlert';

interface UserProfileCollectionsProps {}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserProfileCollections: React.FC<UserProfileCollectionsProps> = () => {
  const { collections, dispatchCollections } = useCollectionsContext();
  const { user } = useAuthContext();
  const { userInfo } = useUserInfoContext();

  const [error, setError] = useState<Error | null>(null);
  const [emptyNameError, setEmptyNameError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [focusedCollection, setFocusedCollection] = useState<
    FocusedCollectionType | undefined
  >(undefined);
  const [isShowingAlert, setIsShowingAlert] = useState<boolean>(false);

  const handleDeleteCollection = async (): Promise<void> => {
    setIsLoading(true);
    const deleteCollectionResponse = await fetch(
      `${API_BASE_URL}/collections/${focusedCollection?.collectionId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user?.token}`,
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
          Authorization: `Bearer ${user?.token}`,
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
      <section className={styles['collections-container']}>
        {collections && (
          <div className={styles['user-profile-collections']}>
            {collections.map((collection) => (
              <React.Fragment key={collection._id}>
                {user?.userId === userInfo?._id ? (
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
                ) : (
                  <>
                    {collection.private === false && (
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
                    )}
                  </>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </section>
      {collections?.length === 0 && (
        <div className={styles['missing-message']}>
          This user doesn't have any collections yet.
        </div>
      )}
    </>
  );
};

export default UserProfileCollections;
