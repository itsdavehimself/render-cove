import SaveSubmitButton from '../SaveSubmitButton/SaveSubmitButton';
import styles from './EditCollectionModal.module.scss';
import { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSave } from '@fortawesome/free-solid-svg-icons';
import FormInput from '../FormInput/FormInput';
import { FocusedCollectionType } from '../../containers/UserCollections/UserCollections';
import CheckboxInput from '../CheckboxInput/CheckboxInput';

interface EditCollectionModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleEditClick: (e: React.FormEvent) => Promise<void>;
  isLoading: boolean;
  focusedCollection: FocusedCollectionType | undefined;
  setFocusedCollection: React.Dispatch<
    React.SetStateAction<FocusedCollectionType | undefined>
  >;
  error: Error | null;
}

const EditCollectionModal: React.FC<EditCollectionModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  handleEditClick,
  isLoading,
  focusedCollection,
  setFocusedCollection,
  error,
}) => {
  const saveIcon: React.ReactNode = <FontAwesomeIcon icon={faSave} />;

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

  return (
    <>
      <div className={styles['modal-overlay']}></div>
      <div className={styles['modal-container']}>
        <div className={styles['edit-collection-modal']}>
          <div className={styles['modal-text']}>
            <h4>Edit collection</h4>
          </div>
          <form onSubmit={handleEditClick}>
            <div className={styles['form-inputs']}>
              <FormInput
                htmlFor="collectionName"
                label="Collection name"
                type="text"
                id="collectionName"
                name="collectionName"
                value={focusedCollection?.title}
                onChange={(e) =>
                  setFocusedCollection((prevState) => ({
                    title: e.target.value,
                    creator: prevState ? prevState.creator || '' : '',
                    isPrivate: prevState ? prevState.isPrivate : false,
                    collectionId: prevState ? prevState.collectionId || '' : '',
                  }))
                }
                serverError={error ? 'Please enter a collection name.' : ''}
              />
              <CheckboxInput
                label="Set as private"
                htmlFor="private"
                name="private"
                id="private"
                isChecked={focusedCollection?.isPrivate || false}
                setIsChecked={(isChecked) =>
                  setFocusedCollection((prevState) => ({
                    ...prevState,
                    title: prevState ? prevState.title || '' : '',
                    creator: prevState ? prevState.creator || '' : '',
                    isPrivate:
                      typeof isChecked === 'function'
                        ? isChecked(prevState?.isPrivate || false)
                        : isChecked,
                    collectionId: prevState ? prevState.collectionId || '' : '',
                  }))
                }
              />
            </div>
            <div className={styles['modal-buttons']}>
              <button
                className={styles.cancel}
                onClick={() => setIsModalOpen(false)}
                type="button"
              >
                Cancel
              </button>
              <SaveSubmitButton
                icon={saveIcon}
                label="Save"
                isLoading={isLoading}
                color="blue"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default EditCollectionModal;
