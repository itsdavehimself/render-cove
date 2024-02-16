import styles from './ChooseUsername.module.scss';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import formImage from '../../assets/images/jungle-cyberpunk-city.png';
import useOAuthSignUp from '../../hooks/useOAuthSignUp';

const ChooseUsername: React.FC = () => {
  const userString = localStorage.getItem('google-signup');
  const user = userString ? JSON.parse(userString) : null;
  const [username, setUsername] = useState<string>('');
  const [usernameError, setUsernameError] = useState<boolean>(false);
  const email: string = user.email;
  const displayName: string = user.displayName;
  const userAvatar: string = user.userAvatar;

  const { signUpWithOAuth, errorOAuth, isLoadingOAuth } = useOAuthSignUp();

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9]{5,16}$/;
    return usernameRegex.test(username);
  };

  const handleSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setUsernameError(false);
    const usernameCheckFailed = !validateUsername(username);
    if (usernameCheckFailed) {
      setUsernameError(usernameCheckFailed);
      return;
    }
    await signUpWithOAuth(email, username, displayName, userAvatar);
  };

  return (
    <div className={styles['choose-username-container']}>
      <div className={styles['form-container']}>
        <div className={styles['form-image']}>
          <img className={styles['background-image']} src={formImage}></img>
          <h3 className={styles['form-copy-large']}>
            EXPERIENCE THE FUTURE OF AI-DRIVEN EXPRESSION
          </h3>
          <p className={styles['form-copy-small']}>
            Discover a haven for AI art enthusiasts. Share your projects,
            exchange ideas, and connect with a community that values the
            precision and depth of your creative process.
          </p>
        </div>
        <div className={styles['form-elements']}>
          <form onSubmit={handleSubmitSignUp} noValidate>
            <h1 className={styles['login-header']}>Almost there...</h1>
            <div className={styles['input-container']}>
              <label htmlFor="username">Choose a username</label>
              <input
                type="username"
                className={`${styles['signup-input']} ${usernameError ? styles.error : ''} ${errorOAuth || errorOAuth ? styles.error : ''}`}
                onChange={(e) => setUsername(e.target.value)}
              />
              <div className={styles['input-error-message']}>
                {usernameError
                  ? 'Username must be between 5-16 characters. Numbers and letters only.'
                  : ''}
                {!usernameError && errorOAuth && <>{errorOAuth.toString()}</>}
              </div>
            </div>
            <button
              className={styles['signup-button']}
              disabled={isLoadingOAuth}
            >
              Sign Up
            </button>
          </form>
          <div className={styles.divider}>
            <div className={styles['divider-line']}></div>
            <span className={styles['divider-text']}>or</span>
            <div className={styles['divider-line']}></div>
          </div>

          <div className={styles['members-container']}>
            Already a member?{' '}
            <Link className={styles.link} to="/signin">
              Sign In
            </Link>
          </div>
          <div className={styles['terms-container']}>
            By logging in to RenderCove, I confirm that I have read and agree to
            the RenderCove Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChooseUsername;
