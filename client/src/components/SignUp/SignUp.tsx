import { useState } from 'react';
import useSignUp from '../../hooks/useSignUp';

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
    <form onSubmit={handleSubmitSignUp}>
      <h3>Sign up</h3>
      <label htmlFor="email">Email:</label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="true"
        onChange={(e) => setEmail(e.target.value)}
      />
      <label htmlFor="password">Password:</label>
      <input
        id="password"
        name="password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />{' '}
      <label htmlFor="displayName">Display Name:</label>
      <input
        id="displayName"
        name="displayName"
        type="text"
        onChange={(e) => setDisplayName(e.target.value)}
      />
      <button disabled={isLoading}>Sign Up</button>
      {error && <div>{error?.toString()}</div>}
    </form>
  );
};

export default SignUp;
