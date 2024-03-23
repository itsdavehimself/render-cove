import {
  Dispatch,
  ReactNode,
  createContext,
  useEffect,
  useReducer,
} from 'react';
import { userInfoReducer } from '../reducers/userInfoReducer';
import { useParams } from 'react-router-dom';
import { SocialEntry } from './AuthContext';
import { UserInfoAction } from '../types/UserInfoActionTypes';
import { Like } from '../types/Project';

export interface UserInfoType {
  email: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  summary: string;
  software: string[];
  generators: string[];
  socials: SocialEntry[];
  createdAt: Date;
  userId: string;
  website: string;
  tagline: string;
  location: string;
  following: string[];
  followers: string[];
  _id: string;
  projects: [{ projectId: string; likes: Like[] }];
}

interface UserInfoContextType {
  dispatchUserInfo: Dispatch<UserInfoAction>;
  userInfo: UserInfoType;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserInfoContext = createContext<UserInfoContextType | null>(null);

const UserInfoContextProvider = ({ children }: { children: ReactNode }) => {
  const { username, userIdToMessage } = useParams();
  const targetUser = username || userIdToMessage;
  const [state, dispatchUserInfo] = useReducer(userInfoReducer, {
    userInfo: null,
  });

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      try {
        const userInfoResponse = await fetch(
          `${API_BASE_URL}/users/${targetUser}`,
          {
            method: 'GET',
          },
        );

        if (userInfoResponse.ok) {
          const userInfo = await userInfoResponse.json();
          dispatchUserInfo({ type: 'GET_INFO', payload: userInfo });
        } else {
          console.error(userInfoResponse.json());
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchUserInfo();
  }, [targetUser]);
  return (
    <UserInfoContext.Provider value={{ ...state, dispatchUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export { UserInfoContext, UserInfoContextProvider };
