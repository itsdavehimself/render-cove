import styles from './UserProfileNavbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faImage,
  faFlask,
  faBookmark,
  faBookOpen,
} from '@fortawesome/free-solid-svg-icons';

interface UserProfileNavbarProps {}

const UserProfileNavbar: React.FC<UserProfileNavbarProps> = () => {
  const latestIcon: React.ReactNode = <FontAwesomeIcon icon={faBolt} />;
  const projectsIcon: React.ReactNode = <FontAwesomeIcon icon={faImage} />;
  const caseStudyIcon: React.ReactNode = <FontAwesomeIcon icon={faFlask} />;
  const collectionsIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faBookmark} />
  );
  const tutorialsIcon: React.ReactNode = <FontAwesomeIcon icon={faBookOpen} />;

  return (
    <nav className={styles['user-profile-navbar']}>
      <div className={styles['user-nav-item']}>
        <div className={styles['user-nav-icon']}>{latestIcon}</div>
        Latest
      </div>
      <div className={styles['user-nav-item']}>
        <div className={styles['user-nav-icon']}>{projectsIcon}</div>
        Projects
        <div className={styles['user-nav-number']}>0</div>
      </div>
      <div className={styles['user-nav-item']}>
        <div className={styles['user-nav-icon']}>{caseStudyIcon}</div>Case
        Studies
        <div className={styles['user-nav-number']}>0</div>
      </div>
      <div className={styles['user-nav-item']}>
        <div className={styles['user-nav-icon']}>{tutorialsIcon}</div>Tutorials
        <div className={styles['user-nav-number']}>0</div>
      </div>
      <div className={styles['user-nav-item']}>
        <div className={styles['user-nav-icon']}>{collectionsIcon}</div>
        Collections
        <div className={styles['user-nav-number']}>0</div>
      </div>
    </nav>
  );
};
export default UserProfileNavbar;
