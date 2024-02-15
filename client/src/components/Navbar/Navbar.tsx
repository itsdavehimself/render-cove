import styles from './Navbar.module.scss';
import { useState } from 'react';
import useLogOut from '../../hooks/useLogOut';
import { Link } from 'react-router-dom';
import { useAuthContext } from '../../hooks/useAuthContext';
import PopOutMenu from '../PopOutMenu/PopOutMenu';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faUserPen } from '@fortawesome/free-solid-svg-icons';
import { faBell } from '@fortawesome/free-solid-svg-icons';
import { faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { faArrowUpFromBracket } from '@fortawesome/free-solid-svg-icons';
import { faArrowRightToBracket } from '@fortawesome/free-solid-svg-icons';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar/SearchBar';

const Navbar: React.FC = () => {
  const [isUserPopOutShowing, setIsUserPopOutShowing] =
    useState<boolean>(false);
  const { logOut } = useLogOut();
  const { user } = useAuthContext();

  const handleLogout = (): void => {
    logOut();
  };

  const handleEditProfile = (): void => {
    console.log('edit profile');
  };

  const logOutSymbol: React.ReactNode = (
    <FontAwesomeIcon icon={faArrowRightFromBracket} />
  );

  const notificationBell: React.ReactNode = <FontAwesomeIcon icon={faBell} />;

  const envelopeIcon: React.ReactNode = <FontAwesomeIcon icon={faEnvelope} />;

  const userEdit: React.ReactNode = <FontAwesomeIcon icon={faUserPen} />;

  const uploadIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faArrowUpFromBracket} />
  );

  const loginIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faArrowRightToBracket} />
  );

  const signupIcon: React.ReactNode = <FontAwesomeIcon icon={faPenToSquare} />;

  return (
    <nav className={styles.navbar}>
      {!user && (
        <>
          <div className={styles['left-third-nav']}>
            <Link className={styles['nav-link']} to="/">
              <div className={styles.logo}>RENDERCOVE</div>
            </Link>
            <div className={styles['nav-links']}>
              <Link className={styles['nav-link']} to="">
                <button>Explore</button>
              </Link>
              <Link className={styles['nav-link']} to="">
                <button>About</button>
              </Link>
              <Link className={styles['nav-link']} to="">
                <button>Donate</button>
              </Link>
            </div>
          </div>
          <SearchBar />
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
        </>
      )}

      {user && (
        <>
          <div className={styles['left-third-nav']}>
            <Link className={styles['nav-link']} to="/">
              <div className={styles.logo}>RENDERCOVE</div>
            </Link>
            <div className={styles['nav-links']}>
              <Link className={styles['nav-link']} to="">
                <button>Explore</button>
              </Link>
              <Link className={styles['nav-link']} to="">
                <button>About</button>
              </Link>
              <Link className={styles['nav-link']} to="">
                <button>Donate</button>
              </Link>
            </div>
          </div>{' '}
          <SearchBar />
          <div className={styles['right-third-nav']}>
            <Link className={styles['nav-link']} to="/create">
              <button className={styles['create-project-button']}>
                <div>{uploadIcon}</div> Upload Project
              </button>
            </Link>

            <div className={styles['notification-icons']}>
              <div className={styles['notification-bell']}>
                {notificationBell}
              </div>
              <div className={styles['notification-envelope']}>
                {envelopeIcon}
              </div>
            </div>
            <div
              className={styles['avatar-container']}
              onClick={() => setIsUserPopOutShowing(!isUserPopOutShowing)}
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
                <PopOutMenu
                  buttons={[
                    {
                      icon: userEdit,
                      label: 'Edit profile',
                      onClick: handleEditProfile,
                    },
                    {
                      icon: logOutSymbol,
                      label: 'Log out',
                      onClick: handleLogout,
                    },
                  ]}
                />
              )}
            </div>
          </div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
