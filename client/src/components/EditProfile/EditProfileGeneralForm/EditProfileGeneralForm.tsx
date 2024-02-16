import styles from './EditProfileGeneralForm.module.scss';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useState } from 'react';
import useUpdateUser from '../../../hooks/useUserUpdate';

const EditProfileGeneralForm: React.FC = () => {
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
    updateUser(formData);
  };

  return (
    <div className={styles['profile-general-form']}>
      <header className={styles['profile-section-header']}>
        <h2 className={styles['edit-profile-header']}>General</h2>
        <p className={styles['edit-profile-description']}>
          Update your display name and username address
        </p>
      </header>
      <form
        className={styles['general-form']}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <div className={styles['form-inputs']}>
          <div className={styles['input-container']}>
            <label
              className={styles['edit-profile-label']}
              htmlFor="displayName"
            >
              Display Name
            </label>
            <input
              className={`${styles['edit-profile-input']} ${displayNameError ? styles.error : ''}`}
              type="text"
              id="displayName"
              name="displayName"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
            ></input>
            {displayNameError && (
              <div className={styles['input-error-message']}>
                Display name must be between 1-20 characters. No special
                characters allowed.
              </div>
            )}
          </div>
          <div className={styles['input-container']}>
            <label className={styles['edit-profile-label']} htmlFor="username">
              Username
            </label>
            <input
              className={`${styles['edit-profile-input']} ${usernameError || error ? styles.error : ''}`}
              type="text"
              id="username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            ></input>
            {usernameError && (
              <div className={styles['input-error-message']}>
                Username must be between 5-16 characters. Numbers and letters
                only.{' '}
              </div>
            )}
            {!usernameError && error && (
              <div className={styles['input-error-message']}>
                {error.toString()}
              </div>
            )}
          </div>
        </div>
        <button className={styles['save-edit-button']} disabled={isLoading}>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfileGeneralForm;
