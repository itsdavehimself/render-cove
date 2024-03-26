import styles from './UserProfileLatest.module.scss';
import { useAllProjectsContext } from '../../../hooks/useAllProjectsContext';
import { useCollectionsContext } from '../../../hooks/useCollectionsContext';
import { useUserInfoContext } from '../../../hooks/useUserInfoContext';
import { useAuthContext } from '../../../hooks/useAuthContext';
import ProjectCard from '../../ProjectCard/ProjectCard';
import CollectionCard from '../../CollectionCard/CollectionCard';
import { FocusedCollectionType } from '../../../containers/UserCollections/UserCollections';
import DeleteModal from '../../DeleteModal/DeleteModal';
import EditCollectionModal from '../../EditCollectionModal/EditCollectionModal';
import EditAlert from '../../EditAlert/EditAlert';
import { useState } from 'react';
import React from 'react';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserProfileLatest: React.FC = () => {
  const { allProjects } = useAllProjectsContext();
  const { collections, dispatchCollections } = useCollectionsContext();
  const { userInfo } = useUserInfoContext();
  const { user } = useAuthContext();

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

      <div className={styles['latest-container']}>
        {allProjects?.length > 0 && (
          <section className={styles['section-container']}>
            <h2 className={styles['section-header']}>Projects</h2>
            <div className={styles.cards}>
              {allProjects
                ?.slice(0, 5)
                .map((project) => (
                  <React.Fragment key={project._id}>
                    {user?.userId === userInfo?._id ? (
                      <ProjectCard
                        title={project?.title}
                        authorDisplayName={userInfo?.displayName}
                        authorUsername={userInfo?.username}
                        imageUrl={project?.images[0].url}
                        avatarUrl={userInfo?.avatarUrl}
                        projectId={project?._id}
                        published={project?.published}
                      />
                    ) : (
                      <>
                        {project?.published === true && (
                          <ProjectCard
                            title={project?.title}
                            authorDisplayName={userInfo?.displayName}
                            authorUsername={userInfo?.username}
                            imageUrl={project?.images[0].url}
                            avatarUrl={userInfo?.avatarUrl}
                            projectId={project?._id}
                            published={project?.published}
                          />
                        )}
                      </>
                    )}
                  </React.Fragment>
                ))}
            </div>
          </section>
        )}
        {collections?.length > 0 && (
          <section className={styles['section-container']}>
            <h2 className={styles['section-header']}>Collections</h2>
            <div className={styles.cards}>
              {collections
                ?.slice(0, 6)
                .map((collection) => (
                  <React.Fragment key={collection?._id}>
                    {user?.userId === userInfo?._id ? (
                      <CollectionCard
                        title={collection?.title}
                        creator={collection?.creator}
                        collectionId={collection?._id}
                        isPrivate={collection?.private}
                        imageUrl={collection?.projects[0]?.images[0]?.url}
                        key={collection?._id}
                        setIsDeleteModalOpen={setIsDeleteModalOpen}
                        setIsEditModalOpen={setIsEditModalOpen}
                        setFocusedCollection={setFocusedCollection}
                      />
                    ) : (
                      <>
                        {collection?.private === false && (
                          <CollectionCard
                            title={collection?.title}
                            creator={collection?.creator}
                            collectionId={collection?._id}
                            isPrivate={collection?.private}
                            imageUrl={collection?.projects[0]?.images[0]?.url}
                            key={collection?._id}
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
          </section>
        )}
      </div>
      {allProjects?.length === 0 && collections?.length === 0 && (
        <div className={styles['missing-message']}>
          This user doesn't have anything to show yet.
        </div>
      )}
    </>
  );
};

export default UserProfileLatest;
