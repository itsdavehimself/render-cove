import { useState } from 'react';
import { useAuthContext } from './useAuthContext';
import { useNavigate } from 'react-router-dom';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface OAuthSignUpResult {
  checkEmailOAuth: (
    email: string,
    displayName: string,
    userAvatar: string,
  ) => Promise<void>;
  signUpWithOAuth: (
    email: string,
    username: string,
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

  const navigate = useNavigate();

  const checkEmailOAuth = async (
    email: string,
    displayName: string,
    userAvatar: string,
  ): Promise<void> => {
    setIsLoadingOAuth(true);
    setErrorOAuth(null);

    const checkEmailResponse = await fetch(
      `${API_BASE_URL}/auth/google-oauth-check-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      },
    );

    const checkEmailJSON = await checkEmailResponse.json();

    if (!checkEmailResponse.ok) {
      setIsLoadingOAuth(false);
      setErrorOAuth(checkEmailJSON.error);
    }

    if (checkEmailResponse.ok) {
      if (checkEmailJSON.message === 'Create new user') {
        localStorage.setItem(
          'google-signup',
          JSON.stringify({ email, displayName, userAvatar }),
        );
        setIsLoadingOAuth(false);
        setErrorOAuth(null);
        navigate('/signup/username');
      } else {
        localStorage.setItem('user', JSON.stringify(checkEmailJSON));
        dispatch({ type: 'LOGIN', payload: checkEmailJSON });
        setIsLoadingOAuth(false);
        setErrorOAuth(null);
      }
    }
  };

  const signUpWithOAuth = async (
    email: string,
    username: string,
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
      body: JSON.stringify({ email, username, displayName, userAvatar }),
    });

    const signUpJSON = await signUpResponse.json();

    if (!signUpResponse.ok) {
      setIsLoadingOAuth(false);
      setErrorOAuth(signUpJSON.error);
    }

    if (signUpResponse.ok) {
      localStorage.removeItem('google-signup');
      localStorage.setItem('user', JSON.stringify(signUpJSON));
      dispatch({ type: 'LOGIN', payload: signUpJSON });
      setIsLoadingOAuth(false);
      setErrorOAuth(null);
    }
  };

  return { checkEmailOAuth, signUpWithOAuth, isLoadingOAuth, errorOAuth };
};

export default useOAuthSignUp;
