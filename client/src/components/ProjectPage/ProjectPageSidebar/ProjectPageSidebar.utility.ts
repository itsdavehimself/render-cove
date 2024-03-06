import UserInfo from '../../../types/UserInfo';
import { UserType } from '../../../context/AuthContext';
import { AuthAction } from '../../../types/ActionTypes';

enum FollowAction {
  Follow = 'follow',
  Unfollow = 'unfollow',
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const handleFollowClick = async (
  action: FollowAction,
  setError: React.Dispatch<React.SetStateAction<Error | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  artistInfo: UserInfo | undefined,
  user: UserType,
  isFollowing: boolean,
  setIsFollowing: React.Dispatch<React.SetStateAction<boolean>>,
  dispatch: React.Dispatch<AuthAction>,
): Promise<void> => {
  setError(null);
  setIsLoading(true);
  const toggleFollowStatusResponse = await fetch(
    `${API_BASE_URL}/users/toggleFollowStatus/${artistInfo?._id}`,
    {
      method: 'PATCH',
      body: JSON.stringify({
        followAction: action,
      }),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${user.token}`,
      },
    },
  );

  const toggleFollowStatusJSON = await toggleFollowStatusResponse.json();

  if (!toggleFollowStatusResponse.ok) {
    setError(toggleFollowStatusJSON);
    setIsLoading(false);
  }

  if (toggleFollowStatusResponse.ok) {
    setError(null);
    setIsLoading(false);

    const mergedUser = { ...user, ...toggleFollowStatusJSON.updatedUser };

    setIsFollowing(!isFollowing);
    dispatch({ type: 'UPDATE_USER', payload: mergedUser });
    localStorage.setItem('user', JSON.stringify(mergedUser));
  }
};

export { FollowAction, handleFollowClick };
