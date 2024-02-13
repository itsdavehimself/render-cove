import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface OAuthSignUpResult {
  signUpWithOAuth: (
    email: string,
    displayName: string,
    userAvatar: string,
  ) => Promise<void>;
  isLoadingOAuth: boolean;
  errorOAuth: Error | null;
}

const useOAuthSignUp = (): OAuthSignUpResult => {
  const [errorOAuth, setErrorOAuth] = useState<Error | null>(null);
  const [isLoadingOAuth, setIsLoadingOAuth] = useState<boolean>(false);
  const { dispatch } = useAuthContext();

  const signUpWithOAuth = async (
    email: string,
    displayName: string,
    userAvatar: string,
  ): Promise<void> => {
    setIsLoadingOAuth(true);
    setErrorOAuth(null);

    const signUpResponse = await fetch(`${API_BASE_URL}/auth/google-oauth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, displayName, userAvatar }),
    });

    const signUpJSON = await signUpResponse.json();

    if (!signUpResponse.ok) {
      setIsLoadingOAuth(false);
      setErrorOAuth(signUpJSON.error);
    }

    if (signUpResponse.ok) {
      localStorage.setItem('user', JSON.stringify(signUpJSON));
      dispatch({ type: 'LOGIN', payload: signUpJSON });
      setIsLoadingOAuth(false);
      setErrorOAuth(null);
    }
  };

  return { signUpWithOAuth, isLoadingOAuth, errorOAuth };
};

export default useOAuthSignUp;
