import { SocialEntry } from '../context/AuthContext';

interface UserInfo {
  email: string;
  displayName: string;
  avatarUrl: string;
  bannerUrl: string;
  summary: string;
  generators: string[];
  software: string[];
  socials: SocialEntry[];
  location: string;
  tagline: string;
  website: string;
  createdAt: Date;
  following: string[];
  followers: string[];
  _id: string;
}

export default UserInfo;
