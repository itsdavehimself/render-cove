import styles from './CollectionsModal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus, faXmark, faSave } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import FormInput from '../FormInput/FormInput';
import CheckboxInput from '../CheckboxInput/CheckboxInput';
import { useParams } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';

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
  const [isPrivate, setIsPrivate] = useState<boolean>(false);

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
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    if (projectId) {
      formData.append('projectId', projectId);
    }

    const requestBody = {
      projectId: projectId,
      private: isPrivate,
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
            <div className={styles.collection}>
              <div className={styles['collection-header']}>
                <h4>Existing Collection</h4>
                <p>1 project</p>
              </div>
              <button className={styles['save-button']}>Save</button>
            </div>
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
                  <button className={styles['new-collection-button']}>
                    <span>{saveIcon}</span>Save collection
                  </button>
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
