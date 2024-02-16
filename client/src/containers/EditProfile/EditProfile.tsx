import styles from './EditProfile.module.scss';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faUser,
  faIdCard,
  faShareNodes,
  faGear,
  faBell,
} from '@fortawesome/free-solid-svg-icons';
import EditProfileNavButton from '../../components/EditProfile/EditProfileNavButton/EditProfileNavButton';
import { FC } from 'react';
import { AllowedViews } from './EditProfile.types';
import { useAuthContext } from '../../hooks/useAuthContext';
import { format, parseISO } from 'date-fns';
import EditProfileGeneralForm from '../../components/EditProfile/EditProfileGeneralForm/EditProfileGeneralForm';
import EditProfileForm from '../../components/EditProfile/EditProfileForm/EditProfileForm';

const EditProfile: React.FC = () => {
  const [currentView, setCurrentView] = useState<AllowedViews>(
    AllowedViews.General,
  );

  const { user } = useAuthContext();

  const isoDateString = user.createdAt.toString();
  const dateObject = parseISO(isoDateString);
  const formattedDate = format(dateObject, 'MMMM dd, yyyy');

  const userIcon: React.ReactNode = <FontAwesomeIcon icon={faUser} />;
  const generalIcon: React.ReactNode = <FontAwesomeIcon icon={faIdCard} />;
  const socialIcon: React.ReactNode = <FontAwesomeIcon icon={faShareNodes} />;
  const accountIcon: React.ReactNode = <FontAwesomeIcon icon={faGear} />;
  const notificationIcon: React.ReactNode = <FontAwesomeIcon icon={faBell} />;

  const formComponents: Record<AllowedViews, FC<object>> = {
    General: EditProfileGeneralForm,
    Profile: EditProfileForm,
    // Social: EditProfileSocialForm,
    // Account: EditProfileAccountForm,
    // Notifications: EditProfileNotificationsForm,
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
          {FormComponent && <FormComponent />}
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
