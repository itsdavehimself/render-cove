import styles from './CollectionsModal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark, faSave } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import FormInput from '../FormInput/FormInput';
import CheckboxInput from '../CheckboxInput/CheckboxInput';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import SaveSubmitButton from '../SaveSubmitButton/SaveSubmitButton';
import ExistingCollection from '../ExistingCollection/ExistingCollection';
import Collection from '../../types/Collection';

interface CollectionsModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const CollectionsModal: React.FC<CollectionsModalProps> = ({
  isModalOpen,
  setIsModalOpen,
}) => {
  const { projectId } = useParams();
  const { user } = useAuthContext();
  const newCollectionIcon: React.ReactNode = <FontAwesomeIcon icon={faPlus} />;
  const cancelIcon: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;
  const saveIcon: React.ReactNode = <FontAwesomeIcon icon={faSave} />;

  const [isCreatingNewCollection, setIsCreatingNewCollection] =
    useState<boolean>(false);
  const [collectionName, setCollectionName] = useState<string>('');
  const [collections, setCollections] = useState<Collection[]>([]);
  const [isPrivate, setIsPrivate] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isLoadingExisting, setIsLoadingExisting] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (isModalOpen) {
      document.body.classList.add(styles['modal-open']);
    } else {
      document.body.classList.remove(styles['modal-open']);
    }

    return () => {
      document.body.classList.remove(styles['modal-open']);
    };
  }, [isModalOpen]);

  const handleCollectionFormSubmit = async (
    e: React.FormEvent,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    if (projectId) {
      formData.append('projectId', projectId);
    }

    const requestBody = {
      projectId: projectId,
      isPrivate: isPrivate,
      collectionName,
    };

    const requestBodyJson = JSON.stringify(requestBody);

    const newCollectionResponse = await fetch(`${API_BASE_URL}/collections/`, {
      method: 'POST',
      body: requestBodyJson,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });

    const collectionsJson = await newCollectionResponse.json();

    if (!newCollectionResponse.ok) {
      setIsLoading(false);
      setError(collectionsJson.error);
    }

    if (newCollectionResponse.ok) {
      setIsLoading(false);
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    const fetchCollections = async (): Promise<void> => {
      setError(null);
      setIsLoading(true);
      const fetchCollectionsResponse = await fetch(
        `${API_BASE_URL}/collections/${user.userId}`,
        {
          method: 'GET',
        },
      );

      const userCollectionsJson = await fetchCollectionsResponse.json();

      if (!fetchCollectionsResponse.ok) {
        setError(userCollectionsJson.error);
        setIsLoading(false);
      }

      if (fetchCollectionsResponse.ok) {
        setIsLoading(false);
        setCollections(userCollectionsJson);
      }
    };

    fetchCollections();
  }, []);

  const handleToggleInCollection = async (
    collectionId: string,
  ): Promise<void> => {
    setIsLoadingExisting(true);
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
      setIsLoadingExisting(false);
    }

    if (toggleCollectionResponse.ok) {
      setIsLoadingExisting(false);

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
    <>
      <div className={styles['modal-overlay']}></div>
      <div className={styles['modal-container']}>
        <div className={styles['bookmark-modal']}>
          <div className={styles.header}>
            <h3>Save project to collection</h3>
            <button
              className={styles['cancel-button']}
              onClick={() => setIsModalOpen(false)}
            >
              {cancelIcon}
            </button>
          </div>
          <div className={styles['existing-collections']}>
            {collections.length > 0 ? (
              <>
                {collections?.map((collection) => (
                  <ExistingCollection
                    title={collection.title}
                    numberOfProjects={collection.projects.length}
                    key={collection._id}
                    saveToCollection={() =>
                      handleToggleInCollection(collection._id)
                    }
                    isSaved={collection.projects.some(
                      (project) => project._id === projectId,
                    )}
                    isLoading={isLoadingExisting}
                  />
                ))}
              </>
            ) : (
              <p className={styles['no-collections-message']}>
                You don't have any collections yet
              </p>
            )}
          </div>
          <div className={styles['new-collection']}>
            {isCreatingNewCollection ? (
              <form
                className={styles['new-collection-form']}
                onSubmit={handleCollectionFormSubmit}
              >
                <FormInput
                  htmlFor="collectionName"
                  label="Collection name"
                  type="text"
                  id="collectionName"
                  name="collectionName"
                  value={collectionName}
                  placeholder="Enter collection name"
                  onChange={(e) => setCollectionName(e.target.value)}
                  clientError={
                    error?.message === 'Missing name'
                      ? 'Please enter a name for your collection'
                      : ''
                  }
                />
                <div className={styles['form-buttons']}>
                  <CheckboxInput
                    label="Set as private"
                    htmlFor="private"
                    name="private"
                    id="private"
                    isChecked={isPrivate}
                    setIsChecked={setIsPrivate}
                  />
                  <SaveSubmitButton
                    icon={saveIcon}
                    label="Create collection"
                    isLoading={isLoading}
                    color="blue"
                  />
                </div>
              </form>
            ) : (
              <button
                className={styles['new-collection-button']}
                onClick={() => setIsCreatingNewCollection(true)}
              >
                <span>{newCollectionIcon}</span>Create new collection
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default CollectionsModal;
