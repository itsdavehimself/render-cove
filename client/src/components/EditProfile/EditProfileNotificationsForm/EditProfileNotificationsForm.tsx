import styles from './EditProfileNotificationsForm.module.scss';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import { useState, useEffect } from 'react';
import CheckboxInput from '../../CheckboxInput/CheckboxInput';
import ToggleSwitch from '../../ToggleSwitch/ToggleSwitch';
import { handleAlert } from '../EditProfile.utility';
import useUpdateUser from '../../../hooks/useUserUpdate';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { AlertInfo } from '../../../containers/EditProfile/EditProfile';
import { EmailNotifications } from '../../../../../server/types/EmailNotifications';

interface EditProfileNotificationsFormProps {
  alertInfo: AlertInfo;
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
}

const EditProfileNotificationsForm: React.FC<
  EditProfileNotificationsFormProps
> = ({ alertInfo, setAlertInfo }) => {
  const { updateUser, isLoading, error } = useUpdateUser();
  const { user } = useAuthContext();
  const [emailCheckedBoxes, setEmailCheckedBoxes] = useState<string[]>([]);
  const emailBoxes: string[] = ['newsletter', 'announcements'];
  const handleEmailFormSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    const emailNotifications: { [key: string]: boolean } = {};

    emailBoxes.forEach((box) => {
      emailNotifications[box] = emailCheckedBoxes.includes(box);
    });

    const emailFormData = new FormData();
    emailFormData.append(
      'emailNotifications',
      JSON.stringify(emailNotifications),
    );

    try {
      await updateUser(emailFormData);
      handleAlert(true, alertInfo, setAlertInfo);
    } catch (updateError) {
      handleAlert(false, alertInfo, setAlertInfo);
    }
  };

  useEffect(() => {
    if (user && user.emailNotifications) {
      const checkedBoxes = Object.keys(user.emailNotifications).filter(
        (key) =>
          user.emailNotifications[key as keyof EmailNotifications] === true,
      );

      setEmailCheckedBoxes(checkedBoxes);
    }
  }, [user]);

  return (
    <div className={styles['edit-profile-form']}>
      <header className={styles['profile-section-header']}>
        <h2 className={styles['edit-profile-header']}>Notifications</h2>
        <p className={styles['edit-profile-description']}>
          Manage how and what you want to be notified about
        </p>
      </header>
      <form
        className={styles['email-notifications-form']}
        onSubmit={handleEmailFormSubmit}
        noValidate
      >
        <div className={styles['notification-section-header']}>
          <h3>Email Subscriptions</h3>
          <ToggleSwitch
            setSectionCheckedBoxes={setEmailCheckedBoxes}
            sectionCheckedBoxes={emailCheckedBoxes}
            boxesIdArray={emailBoxes}
          />
        </div>

        <div className={styles['form-inputs']}>
          <CheckboxInput
            title="RenderCove Newsletter"
            description="Get the latest news regarding AI art, image generation workflows, community insights, and more"
            label="Subscribe to the newsletter"
            htmlFor="newsletter"
            name="newsletter"
            id="newsletter"
            isChecked={emailCheckedBoxes.includes('newsletter')}
            setSectionCheckedBoxes={setEmailCheckedBoxes}
          />
          <CheckboxInput
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
          <SaveSubmitButton label="Save" isLoading={isLoading} color="blue" />
        </div>
        {error && (
          <div className={styles['error-message']}>{error.toString()}</div>
        )}
      </form>
    </div>
  );
};

export default EditProfileNotificationsForm;
