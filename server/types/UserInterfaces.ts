import mongoose from 'mongoose';

interface UserDocument {
  email: string;
  password: string;
  displayName: string;
  summary?: string;
  skills?: string[];
  _id: string;
}

interface UserModel extends mongoose.Model<UserDocument> {
  signup(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserDocument>;
  login(email: string, password: string): Promise<UserDocument>;
}

export { UserDocument, UserModel };
