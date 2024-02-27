import styles from './EditProfilePasswordForm.module.scss';
import { AlertInfo } from '../../../containers/EditProfile/EditProfile';
import EditProfileInput from '../../FormInput/FormInput';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import { useState, useEffect } from 'react';
import { isPasswordValid } from './EditProfilePasswordForm.utility';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { handleAlert } from '../EditProfile.utility';

interface EditProfilePasswordFormProps {
  alertInfo: AlertInfo;
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const EditProfilePasswordForm: React.FC<EditProfilePasswordFormProps> = ({
  alertInfo,
  setAlertInfo,
}) => {
  const { user, dispatch } = useAuthContext();
  const [currentPassword, setCurrentPassword] = useState<string>('');
  const [currentPasswordError, setCurrentPasswordError] =
    useState<boolean>(false);
  const [newPassword, setNewPassword] = useState<string>('');
  const [newPasswordError, setNewPasswordError] = useState<boolean>(false);
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [passwordMatchError, setPasswordMatchError] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [serverError, setServerError] = useState<string>('');
  const [incorrectPasswordError, setIncorrectPasswordError] =
    useState<boolean>(false);
  const [isPasswordSet, setIsPasswordSet] = useState<boolean>(
    user.userSetPassword,
  );

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    setCurrentPasswordError(false);
    setNewPasswordError(false);
    setPasswordMatchError(false);
    setIncorrectPasswordError(false);
    setServerError('');

    if (
      (isPasswordSet && currentPassword.length < 1) ||
      !isPasswordValid(newPassword) ||
      newPassword !== confirmPassword
    ) {
      setCurrentPasswordError(currentPassword.length < 1);
      setNewPasswordError(!isPasswordValid(newPassword));
      setPasswordMatchError(newPassword !== confirmPassword);
      setIsLoading(false);
      return;
    }

    const passwordUpdateResponse = await fetch(
      `${API_BASE_URL}/users/updatePassword/${user.userId}`,
      {
        method: 'PATCH',
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
        headers: {
          Authorization: `Bearer ${user.token}`,
          'Content-Type': 'application/json',
        },
      },
    );

    const passwordUpdateJSON = await passwordUpdateResponse.json();

    if (!passwordUpdateResponse.ok) {
      if (passwordUpdateJSON.error.type !== 'password') {
        setServerError(passwordUpdateJSON.error.message);
        setIsLoading(false);
      }

      if (passwordUpdateJSON.error.type === 'password') {
        setIncorrectPasswordError(true);
        setIsLoading(false);
      }
    }
    handleAlert(false, alertInfo, setAlertInfo);

    if (passwordUpdateResponse.ok) {
      setIsLoading(false);
      handleAlert(true, alertInfo, setAlertInfo);
      setIsPasswordSet(true);
      const mergedUser = { ...user, ...passwordUpdateJSON };
      dispatch({ type: 'UPDATE_USER', payload: mergedUser });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
  };

  useEffect(() => {
    if (newPassword !== confirmPassword) {
      setPasswordMatchError(true);
    } else {
      setPasswordMatchError(false);
    }

    if (newPassword && !isPasswordValid(newPassword)) {
      setNewPasswordError(true);
    } else {
      setNewPasswordError(false);
    }
  }, [currentPassword, newPassword, confirmPassword]);

  return (
    <div className={styles['edit-profile-form']}>
      <header className={styles['profile-section-header']}>
        <h2 className={styles['edit-profile-header']}>Password</h2>
        <p className={styles['edit-profile-description']}>
          Change your password
        </p>
      </header>
      <form
        className={styles['password-form']}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <div className={styles['form-inputs']}>
          {isPasswordSet && (
            <EditProfileInput
              htmlFor="currentPassword"
              label="Current password"
              type="password"
              id="currentPassword"
              name="currentPassword"
              value={currentPassword}
              placeholder="Enter your current password"
              clientError={
                currentPasswordError ? 'Please enter your password' : ''
              }
              serverError={incorrectPasswordError ? 'Incorrect password.' : ''}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          )}
          <EditProfileInput
            htmlFor="newPassword"
            label="New password"
            type="password"
            id="newPassword"
            name="newPassword"
            value={newPassword}
            placeholder="Enter your new password"
            clientError={
              newPasswordError
                ? 'Password must be between 8-20 characters, contain 1 uppercase letter, 1 lowercase letter, and a special character.'
                : ''
            }
            serverError=""
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <EditProfileInput
            htmlFor="confirmPassword"
            label="Confirm new password"
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={confirmPassword}
            placeholder="Confirm your new password"
            clientError={passwordMatchError ? 'Passwords do not match' : ''}
            serverError=""
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className={styles['save-button-container']}>
          <SaveSubmitButton label="Save" isLoading={isLoading} />
        </div>
        <div className={styles['error-message']}>
          {serverError && serverError.toString()}
        </div>
      </form>
    </div>
  );
};

export default EditProfilePasswordForm;
