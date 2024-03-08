import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';
import { UserDocument, UserModel } from '../types/UserInterfaces.js';

const allowedSocialMedia = [
  'facebook',
  'instagram',
  'x',
  'youtube',
  'github',
  'discord',
  'behance',
];

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
    username: {
      type: String,
      required: true,
      trim: true,
    },
    avatarUrl: {
      type: String,
      default:
        'https://rendercove.s3.us-east-2.amazonaws.com/e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855.png',
    },
    bannerUrl: {
      type: String,
      default: '',
    },
    summary: {
      type: String,
      trim: true,
      default: '',
    },
    generators: [
      {
        type: String,
        trim: true,
      },
    ],
    software: [
      {
        type: String,
        trim: true,
      },
    ],
    socials: [
      {
        network: {
          type: String,
          trim: true,
          lowercase: true,
          enum: allowedSocialMedia,
        },
        username: {
          type: String,
          trim: true,
          default: '',
        },
      },
    ],
    location: {
      type: String,
      trim: true,
      default: '',
    },
    tagline: {
      type: String,
      trim: true,
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
    },
    oauthUsed: { type: Boolean, required: true },
    userSetPassword: { type: Boolean, required: true },
    emailNotifications: {
      newsletter: {
        type: Boolean,
        default: false,
      },
      announcements: {
        type: Boolean,
        default: false,
      },
    },
    following: [{ type: String }],
    followers: [{ type: String }],
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    likes: [
      {
        projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

userSchema.statics.signup = async function (
  email,
  password,
  username,
  displayName,
  oauthUsed
): Promise<UserDocument> {
  if (!email || !password || !username) {
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

  const usernameExists = await this.findOne({ username });

  if (usernameExists) {
    throw Error('Username already in use.');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    username,
    displayName,
    oauthUsed,
    userSetPassword: true,
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
