import styles from './EditProfileAccountForm.module.scss';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import EditProfileInput from '../EditProfileInput/EditProfileInput';
import { useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import DeleteAccountModal from '../DeleteAccountModal/DeleteAccountModal';
import { AlertInfo } from '../../../containers/EditProfile/EditProfile';

interface EditProfileAccountFormProps {
  alertInfo: AlertInfo;
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
}

const EditProfileAccountForm: React.FC<EditProfileAccountFormProps> = ({
  alertInfo,
  setAlertInfo,
}) => {
  const { user } = useAuthContext();
  const [email, setEmail] = useState<string>(user.email);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [isConfirmModalShowing, setIsConfirmModalShowing] =
    useState<boolean>(false);

  const handleFormSubmit = (e: React.FormEvent): void => {
    e.preventDefault();
    const emailCheckFailed = !validateEmail(email);
    if (emailCheckFailed) {
      setEmailError(emailCheckFailed);
      return;
    }
    console.log('submitted');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  return (
    <>
      <div className={styles['edit-profile-form']}>
        <header className={styles['profile-section-header']}>
          <h2 className={styles['edit-profile-header']}>Account</h2>
          <p className={styles['edit-profile-description']}>
            Change your email or delete your account
          </p>
        </header>
        <form
          className={styles['account-form']}
          onSubmit={handleFormSubmit}
          noValidate
        >
          <div className={styles['form-inputs']}>
            <EditProfileInput
              htmlFor="email"
              label="Email"
              type="email"
              id="email"
              name="email"
              value={email}
              clientError={
                emailError ? 'Please enter a valid email address.' : ''
              }
              serverError=""
              onChange={(e) => setEmail(e.target.value)}
            />
            {email !== user.email && (
              <EditProfileInput
                htmlFor="password"
                label="Enter your password to change email"
                type="password"
                id="password"
                name="password"
                value={password}
                clientError={
                  emailError ? 'Please enter a valid email address.' : ''
                }
                serverError=""
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </div>
          <div className={styles['save-button-container']}>
            <SaveSubmitButton label="Save" isLoading={false} />
          </div>
        </form>
        <div className={styles['danger-zone']}>
          <div className={styles['danger-zone-text']}>
            <h3>Area of Hazardous Actions</h3>
            <p>
              This action is irreversible! Please make sure you want to do this.
              All of your account information, artworks, and data, will be
              destroyed.
            </p>
          </div>
          <button
            className={styles['delete-account-button']}
            onClick={() => setIsConfirmModalShowing(true)}
          >
            Delete your account
          </button>
        </div>
      </div>
      {isConfirmModalShowing && (
        <DeleteAccountModal
          alertInfo={alertInfo}
          setAlertInfo={setAlertInfo}
          setIsConfirmModalShowing={setIsConfirmModalShowing}
        />
      )}
    </>
  );
};

export default EditProfileAccountForm;
