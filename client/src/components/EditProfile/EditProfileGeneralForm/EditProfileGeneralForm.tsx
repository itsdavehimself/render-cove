import styles from './EditProfileGeneralForm.module.scss';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useState } from 'react';
import useUpdateUser from '../../../hooks/useUserUpdate';
import FormInput from '../../FormInput/FormInput';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import { AlertInfo } from '../../../containers/EditProfile/EditProfile';
import { handleAlert } from '../EditProfile.utility';

interface EditProfileGeneralFormProps {
  alertInfo: AlertInfo;
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
}

const EditProfileGeneralForm: React.FC<EditProfileGeneralFormProps> = ({
  alertInfo,
  setAlertInfo,
}) => {
  const { user } = useAuthContext();
  const { updateUser, error, isLoading } = useUpdateUser();
  const [displayName, setDisplayName] = useState<string>(user.displayName);
  const [username, setUsername] = useState<string>(user.username);
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const [displayNameError, setDisplayNameError] = useState<boolean>(false);

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9]{5,16}$/;
    return usernameRegex.test(username);
  };

  const validateDisplayName = (displayName: string): boolean => {
    const displayNameRegex = /^[a-zA-Z0-9\s]{1,20}$/;
    return displayNameRegex.test(displayName);
  };

  const handleFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const usernameCheckFailed = !validateUsername(username);
    const displayNameCheckFailed = !validateDisplayName(displayName);

    if (usernameCheckFailed || displayNameCheckFailed) {
      setUsernameError(usernameCheckFailed);
      setDisplayNameError(displayNameCheckFailed);
      return;
    }

    setUsernameError(false);
    setDisplayNameError(false);
    const formData = new FormData(e.currentTarget as HTMLFormElement);
    try {
      await updateUser(formData);
      handleAlert(true, alertInfo, setAlertInfo);
    } catch (error) {
      handleAlert(false, alertInfo, setAlertInfo);
    }
  };

  return (
    <div className={styles['edit-profile-form']}>
      <header className={styles['profile-section-header']}>
        <h2 className={styles['edit-profile-header']}>General</h2>
        <p className={styles['edit-profile-description']}>
          Update your display name and username
        </p>
      </header>
      <form
        className={styles['general-form']}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <div className={styles['form-inputs']}>
          <FormInput
            htmlFor="displayName"
            label="Display Name"
            type="text"
            id="displayName"
            name="displayName"
            value={displayName}
            clientError={
              displayNameError
                ? 'Display name must be between 1-20 characters. No special characters allowed.'
                : ''
            }
            onChange={(e) => setDisplayName(e.target.value)}
          />
          <FormInput
            htmlFor="username"
            label="Username"
            type="text"
            id="username"
            name="username"
            value={username}
            clientError={
              usernameError
                ? 'Username must be between 5-16 characters. Numbers and letters only.'
                : ''
            }
            serverError={error?.toString()}
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
        <div className={styles['save-button-container']}>
          <SaveSubmitButton label="Save" isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default EditProfileGeneralForm;
