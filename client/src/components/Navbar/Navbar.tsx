import styles from './Navbar.module.scss';
import { useEffect, useState, useRef } from 'react';
import useLogOut from '../../hooks/useLogOut';
import { Link, useLocation } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import PopOutMenu from '../PopOutMenu/PopOutMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRightFromBracket,
  faUserPen,
  faBell,
  faEnvelope,
  faArrowUpFromBracket,
  faArrowRightToBracket,
  faPenToSquare,
  faEye,
  faBookmark,
  faHeart,
  faBars,
  faTimes,
  // faAngleDown,
  // faFlask,
  // faBookOpen,
} from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';
import { useNotificationContext } from '../../hooks/useNotificationContext';
import Notification from '../../types/Notification';
import NotificationPopout from '../NotificationsPopout/NotificationsPopout';
import { useConversationContext } from '../../hooks/useConversationContext';
import { SocketContext } from '../../context/SocketContext';
import { useContext } from 'react';
import useClickOutside from '../../hooks/useClickOutside';

const Navbar: React.FC = () => {
  const { unreadNotifications, addNotification } = useNotificationContext();
  const { numOfUnreadMessages } = useConversationContext();
  const { logOut } = useLogOut();
  const { user } = useAuthContext();
  const socket = useContext(SocketContext);
  const navigate = useNavigate();
  const location = useLocation();

  const avatarRef = useRef<HTMLDivElement>(null);
  // const createProjectRef = useRef<HTMLButtonElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  useClickOutside(avatarRef, () => setIsUserPopOutShowing(false));
  // useClickOutside(createProjectRef, () => setIsCreatePopOutShowing(false));
  useClickOutside(notificationRef, () => setIsNotificationPopoutOpen(false));

  const [isUserPopOutShowing, setIsUserPopOutShowing] =
    useState<boolean>(false);
  // const [isCreatePopOutShowing, setIsCreatePopOutShowing] =
  //   useState<boolean>(false);
  const [isNotificationPopoutOpen, setIsNotificationPopoutOpen] =
    useState<boolean>(false);
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  useEffect(() => {
    socket?.on('connect', () => {
      socket?.emit('userId', user?.userId);
    });

    const handleReceiveNotification = (notification: Notification) => {
      addNotification(notification);
    };

    socket?.on('receive-notification', handleReceiveNotification);

    return () => {
      socket?.off('receive-notification', handleReceiveNotification);
    };
  }, []);

  const handleLogout = (): void => {
    logOut();
  };

  const handleEditProfile = (): void => {
    navigate('/profile/edit');
  };

  const handleViewProfile = (): void => {
    navigate(`/user/${user?.username}`);
  };

  const logOutSymbol: React.ReactNode = (
    <FontAwesomeIcon icon={faArrowRightFromBracket} />
  );
  const notificationBell: React.ReactNode = <FontAwesomeIcon icon={faBell} />;
  const envelopeIcon: React.ReactNode = <FontAwesomeIcon icon={faEnvelope} />;
  const userEdit: React.ReactNode = <FontAwesomeIcon icon={faUserPen} />;
  const viewProfileIcon: React.ReactNode = <FontAwesomeIcon icon={faEye} />;
  const myCollectionsIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faBookmark} />
  );
  const myLikesIcon: React.ReactNode = <FontAwesomeIcon icon={faHeart} />;
  const uploadIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faArrowUpFromBracket} />
  );
  const loginIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faArrowRightToBracket} />
  );
  const signupIcon: React.ReactNode = <FontAwesomeIcon icon={faPenToSquare} />;
  // const caretDown: React.ReactNode = <FontAwesomeIcon icon={faAngleDown} />;
  // const caseStudyIcon: React.ReactNode = <FontAwesomeIcon icon={faFlask} />;
  // const tutorialsIcon: React.ReactNode = <FontAwesomeIcon icon={faBookOpen} />;
  const barsIcon: React.ReactNode = <FontAwesomeIcon icon={faBars} />;
  const xIcon: React.ReactNode = <FontAwesomeIcon icon={faTimes} />;

  return (
    <nav
      className={`${styles.navbar} ${location.pathname.startsWith('/messages') ? styles.border : ''}`}
    >
      {!user && (
        <>
          <div className={styles['left-third-nav']}>
            <Link className={styles['nav-link']} to="/">
              <div className={styles.logo}>RENDERCOVE</div>
            </Link>
            <div className={styles['nav-links']}>
              <Link className={styles['nav-link']} to="/explore">
                <button className={styles['navbar-nav-button']}>Explore</button>
              </Link>
              <Link className={styles['nav-link']} to="/about">
                <button className={styles['navbar-nav-button']}>About</button>
              </Link>
              <Link className={styles['nav-link']} to="/contact">
                <button className={styles['navbar-nav-button']}>Contact</button>
              </Link>
            </div>
            <button
              className={styles['menu-icon']}
              onClick={() => setIsMenuOpen(true)}
            >
              {barsIcon}
            </button>
            <Link className={styles['nav-link']} to="/">
              <div className={styles['mobile-logo']}>RENDERCOVE</div>
            </Link>
          </div>
          <div className={styles['middle-third-nav']}>
            <SearchBar />
          </div>
          <div className={styles['right-third-nav']}>
            <div className={styles.login}>
              <Link className={styles['nav-link']} to="/signup">
                <button className={styles['signup-button']}>
                  <div className={styles['signup-icon']}>{signupIcon}</div>Sign
                  Up
                </button>
              </Link>
              <Link className={styles['nav-link']} to="/login">
                <button className={styles['login-button']}>
                  <div className={styles['login-icon']}>{loginIcon}</div>Sign In
                </button>
              </Link>
            </div>
          </div>
          {isMenuOpen && (
            <div className={styles['menu-overlay']}>
              <div className={styles['menu-header']}>
                <button
                  className={styles['menu-icon']}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {xIcon}
                </button>
                <Link className={styles['nav-link']} to="/signup">
                  <button className={styles['menu-signup-button']}>
                    <div className={styles['signup-icon']}>{signupIcon}</div>
                    Sign Up
                  </button>
                </Link>
              </div>
              <div className={styles['menu-search']}>
                <SearchBar />
              </div>
              <div className={styles['menu-options']}>
                <Link className={styles['nav-link']} to="/explore">
                  <button
                    className={styles['navbar-nav-button']}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Explore
                  </button>
                </Link>
                <Link className={styles['nav-link']} to="/about">
                  <button
                    className={styles['navbar-nav-button']}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    About
                  </button>
                </Link>
                <Link className={styles['nav-link']} to="/contact">
                  <button
                    className={styles['navbar-nav-button']}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Contact
                  </button>
                </Link>
              </div>
            </div>
          )}
        </>
      )}
      {user && (
        <>
          <div className={styles['left-third-nav']}>
            <Link className={styles['nav-link']} to="/">
              <div className={styles.logo}>RENDERCOVE</div>
            </Link>
            <div className={styles['nav-links']}>
              <Link className={styles['nav-link']} to="/explore">
                <button className={styles['navbar-nav-button']}>Explore</button>
              </Link>
              <Link className={styles['nav-link']} to="/about">
                <button className={styles['navbar-nav-button']}>About</button>
              </Link>
              <Link className={styles['nav-link']} to="/contact">
                <button className={styles['navbar-nav-button']}>Contact</button>
              </Link>
            </div>
            <button
              className={styles['menu-icon']}
              onClick={() => setIsMenuOpen(true)}
            >
              {barsIcon}
            </button>
            <Link className={styles['nav-link']} to="/">
              <div className={styles['mobile-logo']}>RENDERCOVE</div>
            </Link>
          </div>
          <div className={styles['middle-third-nav']}>
            <SearchBar />
          </div>
          <div className={styles['user-right-third-nav']}>
            <div className={styles['create-button-container']}>
              <Link className={styles['nav-link']} to="/create/project">
                <button className={styles['create-project-button']}>
                  <div>{uploadIcon}</div> Upload Project
                </button>
              </Link>
              {/* <button
                className={styles['create-drop-down-button']}
                onClick={() => setIsCreatePopOutShowing(!isCreatePopOutShowing)}
                ref={createProjectRef}
              >
                {caretDown}
              </button>
              {isCreatePopOutShowing && (
                <div className={styles['create-popout-container']}>
                  <PopOutMenu
                    buttons={[
                      {
                        icon: caseStudyIcon,
                        label: 'Create Case Study',
                        onClick: () => console.log('create case study'),
                      },
                      {
                        icon: tutorialsIcon,
                        label: 'Create Tutorial',
                        onClick: () => console.log('create tutorial'),
                      },
                    ]}
                  />
                </div>
              )} */}
            </div>
            <div className={styles['notification-icons']}>
              <button
                className={styles['notification-button']}
                onClick={() =>
                  setIsNotificationPopoutOpen(!isNotificationPopoutOpen)
                }
              >
                <div
                  className={styles['notification-icon']}
                  ref={notificationRef}
                >
                  {unreadNotifications > 0 && (
                    <div className={styles['notification-dot']}>
                      {unreadNotifications < 9 ? unreadNotifications : '9+'}
                    </div>
                  )}
                  {notificationBell}
                  {isNotificationPopoutOpen && (
                    <div className={styles['notification-popout-container']}>
                      <NotificationPopout
                        setIsOpen={setIsNotificationPopoutOpen}
                      />
                    </div>
                  )}
                </div>
              </button>
              <button
                className={styles['mobile-notification-button']}
                onClick={() => navigate('/notifications')}
              >
                <div
                  className={styles['notification-icon']}
                  ref={notificationRef}
                >
                  {unreadNotifications > 0 && (
                    <div className={styles['notification-dot']}>
                      {unreadNotifications < 9 ? unreadNotifications : '9+'}
                    </div>
                  )}
                  {notificationBell}
                </div>
              </button>
              <button
                className={styles['message-button']}
                onClick={() => navigate('/messages')}
              >
                <div className={styles['message-icon']}>
                  {numOfUnreadMessages > 0 && (
                    <div className={styles['notification-dot']}>
                      {numOfUnreadMessages < 9 ? numOfUnreadMessages : '9+'}
                    </div>
                  )}
                  {envelopeIcon}
                </div>
              </button>
            </div>
            <div
              className={styles['avatar-container']}
              onClick={() => setIsUserPopOutShowing(!isUserPopOutShowing)}
              ref={avatarRef}
            >
              <img
                className={styles['user-avatar']}
                src={
                  user.avatarUrl ||
                  'https://rendercove.s3.us-east-2.amazonaws.com/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.png'
                }
                alt={user.displayName || 'User Avatar'}
                loading="lazy"
              />
              {isUserPopOutShowing && (
                <div className={styles['avatar-popout-container']}>
                  <PopOutMenu
                    buttons={[
                      {
                        icon: viewProfileIcon,
                        label: 'View profile',
                        onClick: handleViewProfile,
                      },
                      {
                        icon: userEdit,
                        label: 'Edit profile',
                        onClick: handleEditProfile,
                      },
                      {
                        icon: myCollectionsIcon,
                        label: 'My Collections',
                        onClick: () =>
                          navigate(`/${user.username}/collections`),
                      },
                      {
                        icon: myLikesIcon,
                        label: 'My Likes',
                        onClick: () => navigate(`/${user.username}/likes`),
                      },
                      {
                        icon: logOutSymbol,
                        label: 'Log out',
                        onClick: handleLogout,
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          </div>
        </>
      )}
      {isMenuOpen && (
        <div className={styles['menu-overlay']}>
          <div className={styles['menu-header']}>
            <button
              className={styles['menu-icon']}
              onClick={() => setIsMenuOpen(false)}
            >
              {xIcon}
            </button>
            <div className={styles['menu-create-button-container']}>
              <Link className={styles['nav-link']} to="/create/project">
                <button className={styles['create-project-button']}>
                  <div>{uploadIcon}</div> Upload Project
                </button>
              </Link>
            </div>
          </div>
          <div className={styles['menu-search']}>
            <SearchBar />
          </div>
          <div className={styles['menu-options']}>
            <Link className={styles['nav-link']} to="/explore">
              <button
                className={styles['navbar-nav-button']}
                onClick={() => setIsMenuOpen(false)}
              >
                Explore
              </button>
            </Link>
            <Link className={styles['nav-link']} to="/about">
              <button
                className={styles['navbar-nav-button']}
                onClick={() => setIsMenuOpen(false)}
              >
                About
              </button>
            </Link>
            <Link className={styles['nav-link']} to="/contact">
              <button
                className={styles['navbar-nav-button']}
                onClick={() => setIsMenuOpen(false)}
              >
                Contact
              </button>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
