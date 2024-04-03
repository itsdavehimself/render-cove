import styles from './EditProfileAccountForm.module.scss';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import FormInput from '../../FormInput/FormInput';
import { useState } from 'react';
import { useAuthContext } from '../../../hooks/useAuthContext';
import DeleteAccountModal from '../DeleteAccountModal/DeleteAccountModal';
import { AlertInfo } from '../../../containers/EditProfile/EditProfile';
import { handleAlert } from '../EditProfile.utility';

interface EditProfileAccountFormProps {
  alertInfo: AlertInfo;
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const EditProfileAccountForm: React.FC<EditProfileAccountFormProps> = ({
  alertInfo,
  setAlertInfo,
}) => {
  const { user, dispatch } = useAuthContext();
  const [email, setEmail] = useState<string>(user?.email || '');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [incorrectPasswordError, setIncorrectPasswordError] =
    useState<boolean>(false);
  const [isConfirmModalShowing, setIsConfirmModalShowing] =
    useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setPasswordError(false);
    setEmailError(false);
    setIsLoading(true);

    if (password === '') {
      setPasswordError(true);
      setIsLoading(false);
      return;
    }

    const emailCheckFailed = !validateEmail(email);

    if (emailCheckFailed) {
      setEmailError(emailCheckFailed);
      setIsLoading(false);
      return;
    }

    const emailUpdateResponse = await fetch(
      `${API_BASE_URL}/users/updateEmail/${user?.userId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          password: password,
          email: email,
        }),
        headers: {
          Authorization: `Bearer ${user?.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const emailUpdateJSON = await emailUpdateResponse.json();

    if (!emailUpdateResponse.ok) {
      if (emailUpdateJSON.error.type !== 'password') {
        setServerError(emailUpdateJSON.error.message);
        setIsLoading(false);
      }

      if (emailUpdateJSON.error.type === 'password') {
        setIncorrectPasswordError(true);
        setIsLoading(false);
      }
      handleAlert(false, alertInfo, setAlertInfo);
    }

    if (emailUpdateResponse.ok) {
      setIsLoading(false);
      const mergedUser = { ...user, ...emailUpdateJSON };
      dispatch({ type: 'UPDATE_USER', payload: mergedUser });
      handleAlert(true, alertInfo, setAlertInfo);
    }
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
            <FormInput
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
            {email !== user?.email && (
              <FormInput
                htmlFor="password"
                label="Enter your password to change email"
                type="password"
                id="password"
                name="password"
                value={password}
                clientError={passwordError ? 'Please enter your password' : ''}
                serverError={
                  incorrectPasswordError ? 'Incorrect password.' : ''
                }
                onChange={(e) => setPassword(e.target.value)}
              />
            )}
          </div>
          <div className={styles['save-button-container']}>
            <SaveSubmitButton label="Save" isLoading={isLoading} color="blue" />
          </div>
          <div className={styles['error-message']}>
            {serverError && serverError.toString()}
          </div>
        </form>
        <div className={styles['danger-zone']}>
          <div className={styles['danger-zone-text']}>
            <h3>Danger Zone</h3>
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
