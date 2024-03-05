import styles from './WorkflowImageInput.module.scss';
import { useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faTrash } from '@fortawesome/free-solid-svg-icons';
import { compressImage } from './WorkflowImageInput.utility';

interface WorkflowImageInputProps {
  workflowImage: File | null;
  setWorkflowImage: React.Dispatch<React.SetStateAction<File | null>>;
}

const WorkflowImageInput: React.FC<WorkflowImageInputProps> = ({
  workflowImage,
  setWorkflowImage,
}) => {
  const [error, setError] = useState<string>('');
  const workflowImageRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = e.target.files && e.target.files[0];

    if (file) {
      const acceptedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
      if (!acceptedTypes.includes(file.type)) {
        setError('Only PNG, JPEG, and JPG images are allowed.');
        return;
      }

      const maxSizeMB = 5;
      if (file.size > maxSizeMB * 1024 * 1024) {
        setError(`File size should be up to ${maxSizeMB} MB.`);
        return;
      }

      await compressImage(
        [file],
        { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true },
        setWorkflowImage,
      );
    }
  };

  const imageIcon: React.ReactNode = <FontAwesomeIcon icon={faImage} />;
  const trashIcon: React.ReactNode = <FontAwesomeIcon icon={faTrash} />;

  return (
    <div className={styles['workflow-image-input']}>
      <input
        name="workflowImage"
        id="workflowImage"
        type="file"
        accept="image/png, image/jpeg, image/jpg"
        style={{ display: 'none' }}
        onChange={handleFileChange}
        ref={workflowImageRef}
      />
      <button
        className={styles['workflow-select-button']}
        onClick={() =>
          workflowImageRef.current && workflowImageRef.current.click()
        }
      >
        <span className={styles['image-icon']}>{imageIcon}</span> Choose Image
      </button>
      <span className={styles['selected-image-name']}>
        {workflowImage ? workflowImage.name : 'No file selected'}
      </span>
      {workflowImage && (
        <button
          className={styles['trash-icon']}
          onClick={() => setWorkflowImage(null)}
        >
          {trashIcon}
        </button>
      )}
      {error && <span className={styles['error-message']}>{error}</span>}
    </div>
  );
};

export default WorkflowImageInput;
