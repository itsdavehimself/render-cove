import styles from './EditProfile.module.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faIdCard,
  faShareNodes,
  faGear,
  faBell,
  faLock,
} from '@fortawesome/free-solid-svg-icons';
import EditProfileNavButton from '../../components/EditProfile/EditProfileNavButton/EditProfileNavButton';
import { FC } from 'react';
import { AllowedViews } from './EditProfile.types';
import { useAuthContext } from '../../hooks/useAuthContext';
import { format, parseISO } from 'date-fns';
import EditProfileGeneralForm from '../../components/EditProfile/EditProfileGeneralForm/EditProfileGeneralForm';
import EditProfileForm from '../../components/EditProfile/EditProfileForm/EditProfileForm';
import EditProfileSocialForm from '../../components/EditProfile/EditProfileSocialForm/EditProfileSocialForm';
import EditProfileAccountForm from '../../components/EditProfile/EditProfileAccountForm/EditProfileAccountForm';
import EditProfilePasswordForm from '../../components/EditProfile/EditProfilePasswordForm/EditProfilePasswordForm';
import EditProfileNotificationsForm from '../../components/EditProfile/EditProfileNotificationsForm/EditProfileNotificationsForm';
import EditProfileAlert from '../../components/EditProfile/EditProfileAlert/EditProfileAlert';

export interface AlertInfo {
  isShowing: boolean;
  isSuccess: boolean;
}

const EditProfile: React.FC = () => {
  const [currentView, setCurrentView] = useState<AllowedViews>(
    AllowedViews.General,
  );

  const [alertInfo, setAlertInfo] = useState<AlertInfo>({
    isShowing: false,
    isSuccess: false,
  });

  const { user } = useAuthContext();

  const isoDateString = user.createdAt.toString();
  const dateObject = parseISO(isoDateString);
  const formattedDate = format(dateObject, 'MMMM dd, yyyy');

  const userIcon: React.ReactNode = <FontAwesomeIcon icon={faUser} />;
  const generalIcon: React.ReactNode = <FontAwesomeIcon icon={faIdCard} />;
  const socialIcon: React.ReactNode = <FontAwesomeIcon icon={faShareNodes} />;
  const accountIcon: React.ReactNode = <FontAwesomeIcon icon={faGear} />;
  const passwordIcon: React.ReactNode = <FontAwesomeIcon icon={faLock} />;
  const notificationIcon: React.ReactNode = <FontAwesomeIcon icon={faBell} />;

  const formComponents: Record<
    AllowedViews,
    FC<{
      alertInfo: AlertInfo;
      setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
    }>
  > = {
    General: EditProfileGeneralForm,
    Profile: EditProfileForm,
    Social: EditProfileSocialForm,
    Account: EditProfileAccountForm,
    Password: EditProfilePasswordForm,
    Notifications: EditProfileNotificationsForm,
  };

  const FormComponent = formComponents[currentView];

  return (
    <div className={styles['edit-profile-main']}>
      <div className={styles['edit-profile-container']}>
        <div className={styles['edit-profile-sidebar']}>
          <div className={styles['edit-profile-side-nav']}>
            <EditProfileNavButton
              icon={generalIcon}
              label="General"
              onClick={() => setCurrentView(AllowedViews.General)}
              currentView={currentView}
            />
            <EditProfileNavButton
              icon={userIcon}
              label="Profile"
              onClick={() => setCurrentView(AllowedViews.Profile)}
              currentView={currentView}
            />
            <EditProfileNavButton
              icon={socialIcon}
              label="Social"
              onClick={() => setCurrentView(AllowedViews.Social)}
              currentView={currentView}
            />
            <EditProfileNavButton
              icon={accountIcon}
              label="Account"
              onClick={() => setCurrentView(AllowedViews.Account)}
              currentView={currentView}
            />
            <EditProfileNavButton
              icon={passwordIcon}
              label="Password"
              onClick={() => setCurrentView(AllowedViews.Password)}
              currentView={currentView}
            />
            <EditProfileNavButton
              icon={notificationIcon}
              label="Notifications"
              onClick={() => setCurrentView(AllowedViews.Notifications)}
              currentView={currentView}
            />
          </div>
          <div className={styles['profile-overview']}>
            <div className={styles['user-avatar']}>
              <img src={user.avatarUrl}></img>
            </div>
            <div>
              <div className={styles['user-display-name']}>
                {user.displayName}
              </div>
              <div className={styles['member-since']}>
                Member since {formattedDate}
              </div>
            </div>
          </div>
        </div>
        <div className={styles['edit-profile-forms']}>
          {FormComponent && (
            <FormComponent alertInfo={alertInfo} setAlertInfo={setAlertInfo} />
          )}
        </div>
      </div>
      <div className={styles['edit-profile-alert-container']}>
        {alertInfo.isShowing && (
          <EditProfileAlert isSuccess={alertInfo.isSuccess} />
        )}
      </div>
    </div>
  );
};

export default EditProfile;
