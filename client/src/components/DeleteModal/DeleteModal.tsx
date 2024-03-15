import styles from './DeleteModal.module.scss';
import { useEffect } from 'react';

interface DeleteModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  handleDeleteClick: () => Promise<void>;
  isLoading: boolean;
  type: string;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  handleDeleteClick,
  isLoading,
  type,
}) => {
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
        <div className={styles['delete-project-modal']}>
          <div className={styles['modal-text']}>
            <h4>Are you sure you want to delete this {type}?</h4>
            <p>
              This will permanently delete all data associated with this {type}.
            </p>
          </div>
          <div className={styles['modal-buttons']}>
            <button
              className={styles.cancel}
              onClick={() => setIsModalOpen(false)}
            >
              Cancel
            </button>
            <button
              className={styles.delete}
              onClick={handleDeleteClick}
              disabled={isLoading}
            >
              {isLoading ? (
                <span className={styles['loader-spinner']}></span>
              ) : (
                'Delete'
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default DeleteModal;
