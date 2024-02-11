import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface SignUpResult {
  signUp: (
    email: string,
    password: string,
    displayName: string,
  ) => Promise<void>;
  isLoading: boolean;
  error: Error | null;
}

const useSignUp = (): SignUpResult => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const signUp = async (
    email: string,
    password: string,
    displayName: string,
  ): Promise<void> => {
    setIsLoading(true);
    setError(null);

    const signUpResponse = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password, displayName }),
    });

    const signUpJSON = await signUpResponse.json();

    if (!signUpResponse.ok) {
      setIsLoading(false);
      setError(signUpJSON.error);
    }

    if (signUpResponse.ok) {
      localStorage.setItem('user', JSON.stringify(signUpJSON));
      dispatch({ type: 'LOGIN', payload: signUpJSON });
      setIsLoading(false);
      setError(null);
    }
  };

  return { signUp, isLoading, error };
};

export default useSignUp;
