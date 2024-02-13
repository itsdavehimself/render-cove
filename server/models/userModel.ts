import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { UserDocument, UserModel } from '../types/UserInterfaces.js';

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
    oauthUsed: { type: Boolean, required: true },
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (
  email,
  password,
  displayName,
  oauthUsed
): Promise<UserDocument> {
  if (!email || !password || !displayName) {
    throw Error('All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw Error('Please enter a valid email address.');
  }

  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough.');
  }

  const emailExists = await this.findOne({ email });

  if (emailExists) {
    throw Error('Email already in use.');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    displayName,
    oauthUsed,
  });

  return user;
};

userSchema.statics.login = async function (
  email,
  password
): Promise<UserDocument> {
  if (!email || !password) {
    throw Error('All fields are required.');
  }

  const user: UserDocument = await this.findOne({ email });

  if (!user) {
    throw Error('Invalid email or password. Please try again.');
  }

  const passwordMatch: boolean = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw Error('Invalid email or password. Please try again.');
  }

  return user;
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export default User;
