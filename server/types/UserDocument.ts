import mongoose from 'mongoose';
import { EmailNotifications } from './EmailNotifications';
import UserLike from './UserLike';
import { Types } from 'mongoose';
import UserMessagesOverview from './UserMessagesOverview';

interface UserDocument {
  email: string;
  password: string;
  displayName: string;
  username: string;
  avatarUrl: string;
  bannerUrl: string;
  summary?: string;
  generators?: string[];
  software?: string[];
  socials?: string[];
  location?: string[];
  tagline?: string[];
  website?: string[];
  oauthUsed: boolean;
  userSetPassword: boolean;
  emailNotifications: EmailNotifications;
  _id: string;
  createdAt: Date;
  following: string[];
  followers: string[];
  projects: Types.ObjectId[];
  collections: Types.ObjectId[];
  likes: UserLike[];
  messages: UserMessagesOverview[];
}

interface UserModel extends mongoose.Model<UserDocument> {
  signup(
    email: string,
    password: string,
    displayName: string,
    username: string,
    oauthUsed: boolean,
    userSetPassword: boolean
  ): Promise<UserDocument>;
  login(email: string, password: string): Promise<UserDocument>;
}

export { UserDocument, UserModel };
