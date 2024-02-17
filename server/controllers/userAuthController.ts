import { Request, Response } from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../types/UserInterfaces.js';

const jwtSecret: string = process.env.JWT_SECRET || '';

if (jwtSecret === '') {
  console.error(
    'JWT_SECRET environment variable is not set. Ensure it is set before running the application.'
  );
  process.exit(1);
}

const createToken = (_id: string): string => {
  return jwt.sign({ _id }, jwtSecret, { expiresIn: '3d' });
};

const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;

  try {
    const user: UserDocument = await User.login(email, password);
    const token: string = createToken(user._id);
    const {
      username,
      displayName,
      avatarUrl,
      bannerUrl,
      summary,
      createdAt,
      website,
      location,
      tagline,
      _id: userId,
    } = user;

    res.status(200).json({
      email,
      username,
      displayName,
      avatarUrl,
      bannerUrl,
      summary,
      createdAt,
      userId,
      website,
      location,
      tagline,
      token,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, username, displayName } = req.body;

  try {
    const user: UserDocument = await User.signup(
      email,
      password,
      username,
      displayName,
      false
    );
    const token: string = createToken(user._id);
    const {
      avatarUrl,
      bannerUrl,
      summary,
      createdAt,
      website,
      location,
      tagline,
      _id: userId,
    } = user;

    res.status(200).json({
      email,
      username,
      displayName,
      avatarUrl,
      bannerUrl,
      summary,
      createdAt,
      userId,
      website,
      location,
      tagline,
      token,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const checkEmailOAuth = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email });

  try {
    if (existingUser && existingUser.oauthUsed === false) {
      throw new Error(
        'This account was created using an email. Please try logging in using your email and password.'
      );
    }

    if (existingUser && existingUser.oauthUsed === true) {
      const token = createToken(existingUser._id);
      const {
        username,
        displayName,
        avatarUrl,
        bannerUrl,
        summary,
        createdAt,
        website,
        location,
        tagline,
        _id: userId,
      } = existingUser;

      res.status(200).json({
        email,
        username,
        displayName,
        avatarUrl,
        bannerUrl,
        summary,
        createdAt,
        website,
        location,
        tagline,
        userId,
        token,
      });
    }

    if (!existingUser) {
      res.status(200).json({ message: 'Create new user' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

const signUpWithOAuth = async (req: Request, res: Response): Promise<void> => {
  const { email, username, displayName, userAvatar } = req.body;

  const usernameTaken = await User.findOne({ username });

  try {
    if (usernameTaken) {
      throw new Error('Username taken. Please try another.');
    } else {
      const newUser = await User.create({
        email,
        password: 'GOOGLE_OAUTH_USED!',
        username,
        displayName,
        avatarUrl: userAvatar,
        oauthUsed: true,
      });

      const token = createToken(newUser._id);
      const {
        avatarUrl,
        bannerUrl,
        summary,
        createdAt,
        website,
        location,
        tagline,
        _id: userId,
      } = newUser;

      res.status(200).json({
        email,
        username,
        displayName,
        avatarUrl,
        bannerUrl,
        summary,
        userId,
        website,
        location,
        tagline,
        createdAt,
        token,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export { loginUser, signupUser, checkEmailOAuth, signUpWithOAuth };
