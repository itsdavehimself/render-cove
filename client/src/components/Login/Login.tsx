import { useState } from 'react';
import useLogin from '../../hooks/useLogin';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const { login, error, isLoading } = useLogin();

  const handleSubmitLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    await login(email, password);
  };

  return (
    <form onSubmit={handleSubmitLogin}>
      <h3>Login</h3>
      <label htmlFor="email">Email:</label>
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />{' '}
      <button disabled={isLoading}>Login</button>
      {error && <div>{error.toString()}</div>}
    </form>
  );
};

export default Login;
