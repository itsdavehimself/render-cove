import styles from './DeleteAccountModal.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import useLogOut from '../../../hooks/useLogOut';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { AlertInfo } from '../../../containers/EditProfile/EditProfile';
import { handleAlert } from '../EditProfile.utility';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface DeleteAccountModalProps {
  alertInfo: AlertInfo;
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
  setIsConfirmModalShowing: React.Dispatch<React.SetStateAction<boolean>>;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  alertInfo,
  setAlertInfo,
  setIsConfirmModalShowing,
}) => {
  const xMark: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;
  const { logOut } = useLogOut();
  const { user } = useAuthContext();

  const handleDeleteAccount = async (): Promise<void> => {
    const deleteResponse = await fetch(`${API_BASE_URL}/users/${user.userId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${user.token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!deleteResponse.ok) {
      setIsConfirmModalShowing(false);
      handleAlert(false, alertInfo, setAlertInfo);
    }

    if (deleteResponse.ok) {
      logOut();
    }
  };

  return (
    <div className={styles['delete-account-modal']}>
      <div className={styles['opaque-screen']}>
        <div className={styles['delete-account-alert']}>
          <div className={styles['modal-header']}>
            <h4>Delete account</h4>
            <button
              className={styles['exit-modal-button']}
              onClick={() => setIsConfirmModalShowing(false)}
            >
              {xMark}
            </button>
          </div>
          <p>
            Are you sure you want to delete your account? All of your data will
            be lost.
          </p>
          <div className={styles['button-container']}>
            <button
              className={styles['cancel-button']}
              onClick={() => setIsConfirmModalShowing(false)}
            >
              Cancel
            </button>
            <button
              className={styles['delete-account-button']}
              onClick={handleDeleteAccount}
            >
              Yes, I'm sure
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
