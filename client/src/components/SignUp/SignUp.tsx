import { useState } from 'react';
import useSignUp from '../../hooks/useSignUp';
import styles from './SignUp.module.scss';
import { Link } from 'react-router-dom';
import formImage from '../../assets/images/jungle-cyberpunk-city.png';

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [displayName, setDisplayName] = useState<string>('');
  const { signUp, error, isLoading } = useSignUp();

  const handleSubmitSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password, displayName);
  };

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
            <button className={styles['oauth-button']}>
              Continue with Google
            </button>
            <button className={styles['oauth-button']}>
              Continue with Facebook
            </button>
          </div>
          <div className={styles.divider}>
            <div className={styles['divider-line']}></div>
            <span className={styles['divider-text']}>or</span>
            <div className={styles['divider-line']}></div>
          </div>
          <form onSubmit={handleSubmitSignUp}>
            <div className={styles['input-container']}>
              <label htmlFor="email">Add your email</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="true"
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className={styles['input-container']}>
              <label htmlFor="displayName">Choose a display name</label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                onChange={(e) => setDisplayName(e.target.value)}
              />
            </div>
            <div className={styles['input-container']}>
              <label htmlFor="password">Create a password</label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className={styles['signup-button']} disabled={isLoading}>
              Sign Up
            </button>
            {error && <div>{error?.toString()}</div>}
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
