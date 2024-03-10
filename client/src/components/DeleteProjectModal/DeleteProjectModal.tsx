import { UserType } from '../../context/AuthContext';
import styles from './DeleteProjectModal.module.scss';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface DeleteProjectModalProps {
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  projectId: string | undefined;
  user: UserType;
  setError: React.Dispatch<React.SetStateAction<Error | null>>;
}

const DeleteProjectModal: React.FC<DeleteProjectModalProps> = ({
  isModalOpen,
  setIsModalOpen,
  projectId,
  user,
  setError,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(false);

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

  const handleDeleteProjectClick = async (): Promise<void> => {
    const deleteProjectResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const deleteJson = await deleteProjectResponse.json();

    if (!deleteProjectResponse.ok) {
      setIsModalOpen(false);
      setError(deleteJson.error);
    }

    if (deleteProjectResponse.ok) {
      setIsModalOpen(false);
      navigate('/');
    }
  };

  return (
    <>
      <div className={styles['modal-overlay']}></div>
      <div className={styles['modal-container']}>
        <div className={styles['delete-project-modal']}>
          <div className={styles['modal-text']}>
            <h4>Are you sure you want to delete this project?</h4>
            <p>
              This will permanently delete all data associated with this
              project.
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
              onClick={handleDeleteProjectClick}
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

export default DeleteProjectModal;
