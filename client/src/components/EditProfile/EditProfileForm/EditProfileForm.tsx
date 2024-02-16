import styles from './EditProfileForm.module.scss';

const EditProfileForm: React.FC = () => {
  return (
    <div className={styles['profile-general-form']}>
      <header className={styles['profile-section-header']}>
        <h2 className={styles['edit-profile-header']}>Profile</h2>
        <p className={styles['edit-profile-description']}>
          Add some info to let people know what you're about
        </p>
      </header>
    </div>
  );
};

export default EditProfileForm;
