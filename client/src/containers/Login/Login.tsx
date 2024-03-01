import { useState, useEffect } from 'react';
import useLogin from '../../hooks/useLogin';
import styles from './Login.module.scss';
import { Link } from 'react-router-dom';
import formImage from '../../assets/images/jungle-cyberpunk-city.png';
import GoogleSVG from '../../components/SVGComponents/GoogleSVG';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import useOAuthSignUp from '../../hooks/useOAuthSignUp';
import SaveSubmitButton from '../../components/SaveSubmitButton/SaveSubmitButton';

interface OAuthPayload extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);

  const { login, error, isLoading } = useLogin();
  const { checkEmailOAuth, errorOAuth } = useOAuthSignUp();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailCheck = (): boolean => {
      if (email === '') {
        return true;
      }
      return false;
    };

    const passwordCheck = (): boolean => {
      if (password === '') {
        return true;
      }
      return false;
    };

    if (emailCheck() || passwordCheck()) {
      setEmailError(emailCheck());
      setPasswordError(passwordCheck());
      return;
    }

    setEmailError(false);
    setPasswordError(false);
    await login(email, password);
  };

  const handleCallbackResponse = async (response: { credential: string }) => {
    const userObject: OAuthPayload = jwtDecode(response.credential);
    const email = userObject.email;
    const displayName = userObject.name;
    const userPictureRawUrl = userObject.picture;
    const fullResPictureUrl = userPictureRawUrl?.replace('=s96-c', '=c');
    const userAvatar = fullResPictureUrl;

    if (email && displayName && userAvatar) {
      await checkEmailOAuth(email, displayName, userAvatar);
    }
  };

  const handleGoogleSignIn = (): void => {
    document.cookie = `g_state=;path=/;expires=Thu, 01 Jan 1970 00:00:01 GMT`;

    google.accounts.id.prompt();
  };

  useEffect(() => {
    const initGoogleSignIn = (): void => {
      /* global google*/
      google.accounts.id.initialize({
        client_id:
          '43377408457-0hfctmp1to5dl1ekr8hbvbqnv2l8jlmq.apps.googleusercontent.com',
        callback: handleCallbackResponse,
      });
    };

    initGoogleSignIn();
  }, []);

  return (
    <div className={styles['login-container']}>
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
          <form onSubmit={handleSubmitLogin} noValidate>
            <h1 className={styles['login-header']}>Log In</h1>
            <div className={styles['input-container']}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className={`${styles['signup-input']} ${emailError ? styles.error : ''} ${error || errorOAuth ? styles.error : ''}`}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className={styles['input-error-message']}>
                {emailError ? 'Please enter your email' : ''}
                {errorOAuth && <>{errorOAuth.toString()}</>}
              </div>
            </div>
            <div className={styles['input-container']}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                className={`${styles['signup-input']} ${passwordError ? styles.error : ''} ${error ? styles.error : ''}`}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className={styles['input-error-message']}>
                {passwordError ? 'Please enter your password' : ''}
              </div>
            </div>
            <SaveSubmitButton
              label="Log In"
              isLoading={isLoading}
              color="blue"
            />
            {error && (
              <div className={styles['submit-error']}>{error.toString()}</div>
            )}
          </form>
          <div className={styles.divider}>
            <div className={styles['divider-line']}></div>
            <span className={styles['divider-text']}>or</span>
            <div className={styles['divider-line']}></div>
          </div>
          <div className={styles['oauth-buttons']}>
            <button
              className={styles['oauth-button']}
              onClick={handleGoogleSignIn}
            >
              <GoogleSVG />
              Continue with Google
            </button>
          </div>
          <div className={styles['members-container']}>
            Not a member yet?{' '}
            <Link className={styles.link} to="/signup">
              Sign Up
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

export default Login;
