import styles from './Navbar.module.scss';
import { useState } from 'react';
import useLogOut from '../../hooks/useLogOut';
import { Link } from 'react-router-dom';
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
} from '@fortawesome/free-solid-svg-icons';
import SearchBar from '../SearchBar/SearchBar';
import { useNavigate } from 'react-router-dom';

const Navbar: React.FC = () => {
  const [isUserPopOutShowing, setIsUserPopOutShowing] =
    useState<boolean>(false);
  const { logOut } = useLogOut();
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const handleLogout = (): void => {
    logOut();
  };

  const handleEditProfile = (): void => {
    navigate('/profile/edit');
  };

  const handleViewProfile = (): void => {
    navigate(`/user/${user.username}`);
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
                      onClick: () => navigate(`/user/${user.username}`),
                    },
                    {
                      icon: myLikesIcon,
                      label: 'My Likes',
                      onClick: () => navigate(`/user/${user.username}`),
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
