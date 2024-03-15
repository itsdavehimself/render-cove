import styles from './UserProfileNavbar.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBolt,
  faImage,
  // faFlask,
  faBookmark,
  // faBookOpen,
} from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { useAllProjectsContext } from '../../../hooks/useAllProjectsContext';
import { UserInfoType } from '../../../context/UserInfoContext';
import { useCollectionsContext } from '../../../hooks/useCollectionsContext';

interface UserProfileNavbarProps {
  userInfo: UserInfoType;
}

enum Views {
  Latest = '',
  Projects = 'projects',
  CaseStudies = 'case-studies',
  Tutorials = 'tutorials',
  Collections = 'collections',
}

const UserProfileNavbar: React.FC<UserProfileNavbarProps> = ({ userInfo }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthContext();
  const { allProjects } = useAllProjectsContext();
  const { collections } = useCollectionsContext();

  const [currentView, setCurrentView] = useState<Views>(Views.Latest);

  const latestIcon: React.ReactNode = <FontAwesomeIcon icon={faBolt} />;
  const projectsIcon: React.ReactNode = <FontAwesomeIcon icon={faImage} />;
  // const caseStudyIcon: React.ReactNode = <FontAwesomeIcon icon={faFlask} />;
  const collectionsIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faBookmark} />
  );
  // const tutorialsIcon: React.ReactNode = <FontAwesomeIcon icon={faBookOpen} />;

  const baseUrlParams: string = `/user/${userInfo?.username}`;

  useEffect(() => {
    const currentLocation = location.pathname.replace(
      `/user/${userInfo?.username}/`,
      '',
    );

    const mapLocationToView = (location: string): Views => {
      switch (location) {
        case '':
          return Views.Latest;
        case 'projects':
          return Views.Projects;
        case 'case-studies':
          return Views.CaseStudies;
        case 'tutorials':
          return Views.Tutorials;
        case 'collections':
          return Views.Collections;
        default:
          return Views.Latest;
      }
    };

    const mappedView = mapLocationToView(currentLocation);
    setCurrentView(mappedView);
  }, [location.pathname, userInfo?.username]);

  return (
    <nav className={styles['user-profile-navbar']}>
      <div
        className={`${styles['user-nav-item']} ${currentView === Views.Latest ? styles['current-item'] : ''}`}
        onClick={() => navigate(`${baseUrlParams}/`)}
      >
        <div className={styles['user-nav-icon']}>{latestIcon}</div>
        Latest
      </div>
      <div
        className={`${styles['user-nav-item']} ${currentView === Views.Projects ? styles['current-item'] : ''}`}
        onClick={() => navigate(`${baseUrlParams}/projects`)}
      >
        <div className={styles['user-nav-icon']}>{projectsIcon}</div>
        Projects
        <div className={styles['user-nav-number']}>
          {user?.userId === userInfo?._id
            ? allProjects?.length
            : allProjects?.filter((project) => project?.published).length}
        </div>
      </div>
      {/* <div
        className={`${styles['user-nav-item']} ${currentView === Views.CaseStudies ? styles['current-item'] : ''}`}
        onClick={() => navigate(`${baseUrlParams}/case-studies`)}
      >
        <div className={styles['user-nav-icon']}>{caseStudyIcon}</div>Case
        Studies
        <div className={styles['user-nav-number']}>0</div>
      </div>
      <div
        className={`${styles['user-nav-item']} ${currentView === Views.Tutorials ? styles['current-item'] : ''}`}
        onClick={() => navigate(`${baseUrlParams}/tutorials`)}
      >
        <div className={styles['user-nav-icon']}>{tutorialsIcon}</div>Tutorials
        <div className={styles['user-nav-number']}>0</div>
      </div> */}
      <div
        className={`${styles['user-nav-item']} ${currentView === Views.Collections ? styles['current-item'] : ''}`}
        onClick={() => navigate(`${baseUrlParams}/collections`)}
      >
        <div className={styles['user-nav-icon']}>{collectionsIcon}</div>
        Collections
        <div className={styles['user-nav-number']}>
          {user?.userId === userInfo?._id
            ? collections?.length
            : collections?.filter((collection) => collection?.private === false)
                .length}
        </div>
      </div>
    </nav>
  );
};
export default UserProfileNavbar;
