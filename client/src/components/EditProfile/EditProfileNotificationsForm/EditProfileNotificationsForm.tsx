import styles from './EditProfileNotificationsForm.module.scss';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import { useState } from 'react';
import EditProfileCheckBox from '../EditProfileCheckBox/EditProfileCheckBox';
import ToggleSwitch from '../../ToggleSwitch/ToggleSwitch';

const EditProfileNotificationsForm: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailCheckedBoxes, setEmailCheckedBoxes] = useState<string[]>([]);
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
        className={styles['notifications-form']}
        onSubmit={handleFormSubmit}
        noValidate
      >
        <div className={styles['notification-section-header']}>
          <h3>Email Subscriptions</h3>
          <ToggleSwitch
            setSectionCheckedBoxes={setEmailCheckedBoxes}
            sectionCheckedBoxes={emailCheckedBoxes}
            boxesIdArray={['newsletter', 'announcements']}
          />
        </div>

        <div className={styles['form-inputs']}>
          <EditProfileCheckBox
            title="RenderCove Newsletter"
            description="Get the latest news regarding AI art, image generation workflows, community insights, and more"
            label="Subscribe to the newsletter"
            htmlFor="newsletter"
            name="newsletter"
            id="newsletter"
            isChecked={emailCheckedBoxes.includes('newsletter')}
            setSectionCheckedBoxes={setEmailCheckedBoxes}
          />
          <EditProfileCheckBox
            title="RenderCove Announcements"
            description="Get notified of updates, changes, and other stuff happening with the RenderCove platform"
            label="Subscribe to the announcements"
            htmlFor="announcements"
            name="announcements"
            id="announcements"
            isChecked={emailCheckedBoxes.includes('announcements')}
            setSectionCheckedBoxes={setEmailCheckedBoxes}
          />
        </div>
        <div className={styles['save-button-container']}>
          <SaveSubmitButton label="Save" isLoading={isLoading} />
        </div>
      </form>
    </div>
  );
};

export default EditProfileNotificationsForm;
