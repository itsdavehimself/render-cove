import { useState } from 'react';
import useLogin from '../../hooks/useLogin';
import styles from './Login.module.scss';
import { Link } from 'react-router-dom';
import formImage from '../../assets/images/jungle-cyberpunk-city.png';
import GoogleSVG from '../SVGComponents/GoogleSVG';
import FaceBookSVG from '../SVGComponents/FaceBookSVG';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [emailError, setEmailError] = useState<boolean>(false);

  const { login, error, isLoading } = useLogin();

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
          <form onSubmit={handleSubmitLogin}>
            <h1 className={styles['login-header']}>Log In</h1>
            <div className={styles['input-container']}>
              <label htmlFor="email">Email</label>
              <input
                type="email"
                className={`${styles['signup-input']} ${emailError ? styles.error : ''} ${error ? styles.error : ''}`}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className={styles['input-error-message']}>
                {emailError ? 'Please enter your email' : ''}
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
            <button className={styles['signup-button']} disabled={isLoading}>
              Log In
            </button>
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
            <button className={styles['oauth-button']}>
              <GoogleSVG />
              Continue with Google
            </button>
            <button className={styles['oauth-button']}>
              <FaceBookSVG />
              Continue with Facebook
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
