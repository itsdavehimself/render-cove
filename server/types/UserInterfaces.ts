import mongoose from 'mongoose';

interface UserDocument {
  email: string;
  password: string;
  displayName: string;
  avatarUrl: string;
  summary?: string;
  skills?: string[];
  socials?: string[];
  location?: string[];
  tagline?: string[];
  oauthUsed: boolean;
  _id: string;
  createdAt: Date;
}

interface UserModel extends mongoose.Model<UserDocument> {
  signup(
    email: string,
    password: string,
    displayName: string,
    oauthUsed: boolean
  ): Promise<UserDocument>;
  login(email: string, password: string): Promise<UserDocument>;
}

export { UserDocument, UserModel };
