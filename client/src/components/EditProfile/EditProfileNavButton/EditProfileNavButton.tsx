import styles from './EditProfileNavButton.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';
import { AllowedViews } from '../../../containers/EditProfile/EditProfile.types';

interface EditProfileNavButtonProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  currentView: AllowedViews;
}

const EditProfileNavButton: React.FC<EditProfileNavButtonProps> = ({
  icon,
  label,
  onClick,
  currentView,
}) => {
  const caretIcon = <FontAwesomeIcon icon={faCaretRight} />;

  return (
    <button
      className={`${styles['edit-profile-button']} ${currentView === label ? styles['selected'] : ''}`}
      onClick={onClick}
    >
      <div className={styles['edit-profile-icon']}>{icon}</div>
      <div>{label}</div>
      <div className={styles['caret-icon']}>
        {currentView === label && <>{caretIcon}</>}
      </div>
    </button>
  );
};

export default EditProfileNavButton;
