import styles from './PublishSidebar.module.scss';
import SaveSubmitButton from '../SaveSubmitButton/SaveSubmitButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faAngleDown,
  faAngleUp,
  faFloppyDisk,
  faCloudArrowUp,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

interface PublishSidebarProps {
  isProjectPublished: boolean;
  setIsProjectPublished: React.Dispatch<React.SetStateAction<boolean>>;
}

const PublishSidebar: React.FC<PublishSidebarProps> = ({
  isProjectPublished,
  setIsProjectPublished,
}) => {
  const [isDropDownOpen, setIsDropDownOpen] = useState<boolean>(false);
  const downArrowIcon: React.ReactNode = <FontAwesomeIcon icon={faAngleDown} />;
  const upArrowIcon: React.ReactNode = <FontAwesomeIcon icon={faAngleUp} />;
  const saveIcon: React.ReactNode = <FontAwesomeIcon icon={faFloppyDisk} />;
  const publishIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faCloudArrowUp} />
  );

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
          isLoading={false}
          color="blue"
        />
        <SaveSubmitButton
          icon={publishIcon}
          label="Publish"
          isLoading={false}
          color="green"
        />
      </div>
    </section>
  );
};

export default PublishSidebar;
