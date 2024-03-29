import { useState, useEffect } from 'react';
import useSignUp from '../../hooks/useSignUp.js';
import useOAuthSignUp from '../../hooks/useOAuthSignUp.js';
import styles from './SignUp.module.scss';
import { Link } from 'react-router-dom';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import formImage from '../../assets/images/jungle-cyberpunk-city.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import GoogleSVG from '../../components/SVGComponents/GoogleSVG.js';
import SaveSubmitButton from '../../components/SaveSubmitButton/SaveSubmitButton.js';

interface PasswordChecks {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  symbol: boolean;
}

interface OAuthPayload extends JwtPayload {
  email?: string;
  name?: string;
  picture?: string;
}

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [username, setUsername] = useState<string>('');
  const { signUp, error, isLoading } = useSignUp();
  const { checkEmailOAuth, errorOAuth } = useOAuthSignUp();
  const [passwordChecks, setPasswordChecks] = useState<PasswordChecks>({
    length: false,
    uppercase: false,
    lowercase: false,
    symbol: false,
  });
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);
  const [usernameError, setUsernameError] = useState<boolean>(false);

  const xmark = <FontAwesomeIcon icon={faXmark} size="xs" />;
  const check = <FontAwesomeIcon icon={faCheck} size="xs" />;

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const validateUsername = (username: string): boolean => {
    const usernameRegex = /^[a-zA-Z0-9]{5,16}$/;
    return usernameRegex.test(username);
  };

  const handleSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwordCheckFailed = Object.values(passwordChecks).some(
      (check) => !check,
    );
    const emailCheckFailed = !validateEmail(email);
    const usernameCheckFailed = !validateUsername(username);

    if (passwordCheckFailed || emailCheckFailed || usernameCheckFailed) {
      setPasswordError(passwordCheckFailed);
      setEmailError(emailCheckFailed);
      setUsernameError(usernameCheckFailed);
      return;
    }

    setPasswordError(false);
    setEmailError(false);
    await signUp(email, password, username);
  };

  useEffect(() => {
    const checkPassword = () => {
      const lengthCheck = password.length >= 8;
      const uppercaseCheck = /[A-Z]/.test(password);
      const lowercaseCheck = /[a-z]/.test(password);
      const symbolCheck = /[!@#$%^&*()-=_+{};':"\\|,.<>?/`~]/.test(password);

      setPasswordChecks({
        length: lengthCheck,
        uppercase: uppercaseCheck,
        lowercase: lowercaseCheck,
        symbol: symbolCheck,
      });
    };

    checkPassword();
  }, [password]);

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
    <div className={styles['signup-container']}>
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
          <h1 className={styles['signup-header']}>Join RenderCove</h1>
          <div className={styles['oauth-buttons']}>
            <button
              className={styles['oauth-button']}
              onClick={handleGoogleSignIn}
              disabled={isLoading}
            >
              <GoogleSVG />
              Continue with Google
            </button>
          </div>
          <div className={styles.divider}>
            <div className={styles['divider-line']}></div>
            <span className={styles['divider-text']}>or</span>
            <div className={styles['divider-line']}></div>
          </div>
          <form onSubmit={handleSubmitSignUp} noValidate>
            <div className={styles['input-container']}>
              <label htmlFor="email">Add your email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="true"
                placeholder="E.g. john@mccarthy.com"
                onChange={(e) => setEmail(e.target.value)}
                className={`${styles['signup-input']} ${emailError || errorOAuth ? styles.error : ''}`}
              />
              <div className={styles['input-error-message']}>
                {emailError ? 'Please enter a valid email' : ''}
                {errorOAuth && <>{errorOAuth.toString()}</>}
              </div>
            </div>
            <div className={styles['input-container']}>
              <label htmlFor="username">Choose a username</label>
              <input
                id="username"
                name="username"
                type="text"
                onChange={(e) => setUsername(e.target.value)}
                className={`${styles['signup-input']} ${usernameError ? styles.error : ''}`}
              />
              <div className={styles['input-error-message']}>
                {usernameError
                  ? 'Username must be between 5-16 characters. Letters and numbers only.'
                  : ''}
              </div>
            </div>
            <div className={styles['input-container']}>
              <label htmlFor="password">Create a password</label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
                className={`${styles['signup-input']} ${passwordError ? styles.error : ''}`}
              />
              <div className={styles['validation-container']}>
                <div className={styles.validation}>
                  <div className={styles['validation-symbol']}>
                    {passwordChecks.length ? check : xmark}
                  </div>
                  <div className={styles['validation-type']}>
                    Minimum 8 characters
                  </div>
                </div>
                <div className={styles.validation}>
                  <div className={styles['validation-symbol']}>
                    {passwordChecks.uppercase ? check : xmark}
                  </div>
                  <div className={styles['validation-type']}>
                    1 uppercase letter
                  </div>
                </div>
                <div className={styles.validation}>
                  <div className={styles['validation-symbol']}>
                    {passwordChecks.lowercase ? check : xmark}
                  </div>
                  <div className={styles['validation-type']}>
                    1 lowercase letter
                  </div>
                </div>
                <div className={styles.validation}>
                  <div className={styles['validation-symbol']}>
                    {passwordChecks.symbol ? check : xmark}
                  </div>
                  <div className={styles['validation-type']}>
                    1 symbol character
                  </div>
                </div>
              </div>
            </div>
            <SaveSubmitButton
              label="Sign Up"
              isLoading={isLoading}
              color="blue"
            />
            {error && (
              <div className={styles['submit-error']}>{error?.toString()}</div>
            )}
          </form>
          <div className={styles['members-container']}>
            Already a member?{' '}
            <Link className={styles.link} to="/login">
              Log In
            </Link>
          </div>
          <div className={styles['terms-container']}>
            By joining RenderCove, I confirm that I have read and agree to the
            RenderCove Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
