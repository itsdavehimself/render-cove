import { useState } from 'react';
import { useAuthContext } from './useAuthContext';

const useUpdateUser = () => {
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const API_BASE_URL: string =
    import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

  const { user, dispatch } = useAuthContext();

  const update = async (formData: FormData) => {
    setIsLoading(true);
    setError(null);

    const updatedFields: Record<string, string | Blob> = {};
    formData.forEach((value, key) => {
      updatedFields[key] = value;
    });

    const updateResponse = await fetch(`${API_BASE_URL}/users/${user.userId}`, {
      method: 'PATCH',
      body: JSON.stringify(updatedFields),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    });

    const updateJSON = await updateResponse.json();

    if (!updateResponse.ok) {
      setError(new Error(updateJSON));
    }

    if (updateResponse.ok) {
      const mergedUser = { ...user, ...updatedFields };

      dispatch({ type: 'UPDATE_USER', payload: mergedUser });

      localStorage.setItem('user', JSON.stringify(mergedUser));

      setError(null);
      setIsLoading(false);
    }
  };

  return { update, error, isLoading };
};

export default useUpdateUser;
