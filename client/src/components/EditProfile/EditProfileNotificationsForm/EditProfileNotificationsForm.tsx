import styles from './EditProfileNotificationsForm.module.scss';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import { useState } from 'react';

const EditProfileNotificationsForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('submitted');
  };

  return (
    <div className={styles['edit-profile-form']}>
      <header className={styles['profile-section-header']}>
        <h2 className={styles['edit-profile-header']}>Notifications</h2>
        <p className={styles['edit-profile-description']}>
          Manage how and what you want to be notified about
        </p>
      </header>
      <form
        className={styles['general-form']}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <div className={styles['form-inputs']}></div>
        <div className={styles['save-button-container']}>
          <SaveSubmitButton label="Save" isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default EditProfileNotificationsForm;
