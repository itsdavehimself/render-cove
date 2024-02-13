import { Request, Response } from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../types/UserInterfaces.js';
import { error } from 'console';

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
    const displayName = user.displayName;
    const avatarUrl = user.avatarUrl;

    res.status(200).json({ email, displayName, avatarUrl, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, displayName } = req.body;

  try {
    const user: UserDocument = await User.signup(
      email,
      password,
      displayName,
      false
    );
    const token: string = createToken(user._id);
    const avatarUrl = user.avatarUrl;

    res.status(200).json({ email, displayName, avatarUrl, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const signUpWithOAuth = async (req: Request, res: Response): Promise<void> => {
  const { email, displayName, userAvatar } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser && existingUser.oauthUsed === false) {
      throw new Error(
        'This account was creating using an email. Please try logging in using your email and password.'
      );
    }

    if (existingUser) {
      const token = createToken(existingUser._id);
      res.status(200).json({
        email: existingUser.email,
        displayName: existingUser.displayName,
        avatarUrl: existingUser.avatarUrl,
        token,
      });
    } else {
      const newUser = await User.create({
        email,
        password: 'GOOGLE_OAUTH_USED!',
        displayName,
        avatarUrl: userAvatar,
        oauthUsed: true,
      });

      const token = createToken(newUser._id);
      res.status(200).json({
        email: newUser.email,
        displayName: newUser.displayName,
        avatarUrl: newUser.avatarUrl,
        token,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export { loginUser, signupUser, signUpWithOAuth };
