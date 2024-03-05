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

interface UserInfoType {
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
}

interface UserInfoContextType {
  dispatchUserInfo: Dispatch<UserInfoAction>;
  userInfo: UserInfoType;
}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const UserInfoContext = createContext<UserInfoContextType | null>(null);

const UserInfoContextProvider = ({ children }: { children: ReactNode }) => {
  const { username } = useParams();
  const [state, dispatchUserInfo] = useReducer(userInfoReducer, {
    userInfo: null,
  });

  useEffect(() => {
    const fetchUserInfo = async (): Promise<void> => {
      try {
        const userInfoResponse = await fetch(
          `${API_BASE_URL}/users/${username}`,
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
  }, [username]);
  console.log('userInfo', state);
  return (
    <UserInfoContext.Provider value={{ ...state, dispatchUserInfo }}>
      {children}
    </UserInfoContext.Provider>
  );
};

export { UserInfoContext, UserInfoContextProvider };