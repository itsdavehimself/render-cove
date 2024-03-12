import styles from './EditAlert.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck, faXmark } from '@fortawesome/free-solid-svg-icons';

interface EditAlertProps {
  isSuccess: boolean;
  itemToUpdate: string;
}

const EditAlert: React.FC<EditAlertProps> = ({ isSuccess, itemToUpdate }) => {
  const checkIcon: React.ReactNode = <FontAwesomeIcon icon={faCheck} />;
  const xMark: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;

  return (
    <div className={styles['edit-profile-alert']}>
      {isSuccess ? (
        <>
          <div className={`${styles['status-icon']} ${styles['success']}`}>
            {checkIcon}
          </div>
          <div>{itemToUpdate} successfully updated.</div>
        </>
      ) : (
        <>
          <div className={`${styles['status-icon']} ${styles['fail']}`}>
            {xMark}
          </div>
          <div>Something went wrong. Please try again.</div>
        </>
      )}
    </div>
  );
};

export default EditAlert;
