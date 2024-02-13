import { useState } from 'react';
import useLogin from '../../hooks/useLogin';
import styles from './Login.module.scss';
import { Link } from 'react-router-dom';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { login, error, isLoading } = useLogin();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <div className={styles['login-container']}>
      <div className={styles['form-container']}>
        <div className={styles['form-image']}>
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
              <input type="email" onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className={styles['input-container']}>
              <label htmlFor="password">Password</label>
              <input
                type="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <button className={styles['signup-button']} disabled={isLoading}>
              Log In
            </button>
            {error && <div>{error.toString()}</div>}
          </form>
          <div className={styles.divider}>
            <div className={styles['divider-line']}></div>
            <span className={styles['divider-text']}>or</span>
            <div className={styles['divider-line']}></div>
          </div>
          <div className={styles['oauth-buttons']}>
            <button className={styles['oauth-button']}>
              Continue with Google
            </button>
            <button className={styles['oauth-button']}>
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
