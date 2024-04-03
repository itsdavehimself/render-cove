import { UserInfoType } from '../context/UserInfoContext';

export interface UserInfoState {
  userInfo: UserInfoType | null;
}

export type UserInfoAction =
  | { type: 'GET_INFO'; payload: UserInfoType }
  | { type: 'UPDATE_INFO'; payload: UserInfoType };

export const userInfoReducer = (
  state: UserInfoState,
  action: UserInfoAction,
) => {
  switch (action.type) {
    case 'GET_INFO':
      return { userInfo: action.payload };
    case 'UPDATE_INFO':
      return { userInfo: action.payload };
    default:
      return state;
  }
};
