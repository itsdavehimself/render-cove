import { UserType } from '../../context/AuthContext';
import { Dispatch } from 'react';
import { AuthAction } from '../../types/ActionTypes';
import { UserInfoAction } from '../../types/UserInfoActionTypes';

export enum FollowAction {
  Follow = 'follow',
  Unfollow = 'unfollow',
}

const handleFollowClick = async (
  action: FollowAction,
  setError: React.Dispatch<React.SetStateAction<Error | null>>,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  API_BASE_URL: string,
  currentProfileId: string | undefined,
  userIdToFollow: string,
  user: UserType,
  dispatch: Dispatch<AuthAction>,
  dispatchUserInfo: Dispatch<UserInfoAction>,
  isProfilePage: boolean,
): Promise<void> => {
  setError(null);
  setIsLoading(true);
  const toggleFollowStatusResponse = await fetch(
    `${API_BASE_URL}/users/toggleFollowStatus/${userIdToFollow}`,
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

    if (currentProfileId !== user.userId && isProfilePage) {
      dispatchUserInfo({
        type: 'UPDATE_INFO',
        payload: toggleFollowStatusJSON.toggledUser,
      });
    }

    dispatch({ type: 'UPDATE_USER', payload: mergedUser });
    localStorage.setItem('user', JSON.stringify(mergedUser));
  }
};

export default handleFollowClick;
