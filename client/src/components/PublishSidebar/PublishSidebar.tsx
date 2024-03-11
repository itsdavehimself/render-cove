import styles from './PublishSidebar.module.scss';
import SaveSubmitButton from '../SaveSubmitButton/SaveSubmitButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faFloppyDisk,
  faCloudArrowUp,
  faTrash,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface PublishSidebarProps {
  isProjectPublished: boolean;
  setIsProjectPublished: React.Dispatch<React.SetStateAction<boolean>>;
  isLoading: boolean;
  isEditing: boolean;
  isDeleteModalOpen?: boolean;
  setIsDeleteModalOpen?: React.Dispatch<React.SetStateAction<boolean>>;
  previouslyPublished?: boolean;
}

const PublishSidebar: React.FC<PublishSidebarProps> = ({
  isProjectPublished,
  setIsProjectPublished,
  isLoading,
  isEditing,
  isDeleteModalOpen,
  setIsDeleteModalOpen,
  previouslyPublished,
}) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const downArrowIcon: React.ReactNode = <FontAwesomeIcon icon={faAngleDown} />;
  const upArrowIcon: React.ReactNode = <FontAwesomeIcon icon={faAngleUp} />;
  const saveIcon: React.ReactNode = <FontAwesomeIcon icon={faFloppyDisk} />;
  const publishIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faCloudArrowUp} />
  );
  const deleteIcon: React.ReactNode = <FontAwesomeIcon icon={faTrash} />;

  const handlePublishOptionClick = (published: boolean): void => {
    setIsProjectPublished(published);
    setIsDropDownOpen(false);
  };

  return (
    <section className={styles['publish-container']}>
      <h3 className={styles['publish-header']}>Publishing Details</h3>
      <div className={styles['dropdown-container']}>
        <div
          className={styles['publish-status-dropdown']}
          onClick={() => setIsDropDownOpen(!isDropDownOpen)}
        >
          <p className={styles['publish-selected']}>
            {isProjectPublished ? 'Published' : 'Not published'}
          </p>
          <span className={styles['dropdown-arrow']}>
            {isDropDownOpen ? upArrowIcon : downArrowIcon}
          </span>
        </div>
        {isDropDownOpen && (
          <ul className={styles['publish-options']}>
            <li
              onClick={() => handlePublishOptionClick(false)}
              className={`${styles['publish-option']} ${!isProjectPublished ? styles['not-published'] : ''}`}
            >
              Not published
            </li>
            <li
              onClick={() => handlePublishOptionClick(true)}
              className={`${styles['publish-option']} ${isProjectPublished ? styles['published'] : ''}`}
            >
              Published
            </li>
          </ul>
        )}
      </div>

      <div className={styles['publishing-buttons']}>
        <SaveSubmitButton
          icon={saveIcon}
          label="Save"
          isLoading={isLoading}
          color="blue"
        />
        {!previouslyPublished && (
          <SaveSubmitButton
            icon={publishIcon}
            label="Publish"
            isLoading={isLoading}
            color="green"
          />
        )}
        {isEditing && setIsDeleteModalOpen && (
          <button
            className={styles['delete-button']}
            type="button"
            onClick={() => setIsDeleteModalOpen(!isDeleteModalOpen)}
          >
            <span>{deleteIcon}</span>Delete
          </button>
        )}
      </div>
    </section>
  );
};

export default PublishSidebar;
