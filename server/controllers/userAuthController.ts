import { Request, Response } from 'express';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import { UserDocument } from '../types/UserDocument.js';

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
    let userQuery = User.findOne({ email: email });
    userQuery = userQuery.populate({
      path: 'projects',
      select: '_id likes',
    });

    const user: UserDocument | null = await userQuery.exec();
    if (!user) {
      throw new Error('User not found');
    }

    const token: string = createToken(user._id);
    const {
      username,
      displayName,
      avatarUrl,
      bannerUrl,
      generators,
      software,
      summary,
      createdAt,
      website,
      location,
      tagline,
      socials,
      oauthUsed,
      userSetPassword,
      emailNotifications,
      following,
      followers,
      _id: userId,
      likes,
      projects,
    } = user;

    res.status(200).json({
      email,
      username,
      displayName,
      avatarUrl,
      bannerUrl,
      generators,
      software,
      summary,
      createdAt,
      userId,
      website,
      location,
      tagline,
      socials,
      oauthUsed,
      userSetPassword,
      emailNotifications,
      following,
      followers,
      likes,
      token,
      projects,
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
      false,
      true
    );
    const token: string = createToken(user._id);
    const {
      avatarUrl,
      bannerUrl,
      summary,
      generators,
      software,
      createdAt,
      website,
      location,
      tagline,
      socials,
      oauthUsed,
      userSetPassword,
      emailNotifications,
      following,
      followers,
      _id: userId,
      likes,
      projects,
    } = user;

    res.status(200).json({
      email,
      username,
      displayName,
      avatarUrl,
      bannerUrl,
      summary,
      generators,
      software,
      createdAt,
      userId,
      website,
      location,
      tagline,
      socials,
      token,
      oauthUsed,
      userSetPassword,
      emailNotifications,
      following,
      followers,
      likes,
      projects,
    });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const checkEmailOAuth = async (req: Request, res: Response): Promise<void> => {
  const { email } = req.body;

  const existingUser = await User.findOne({ email })
    .populate({ path: 'projects', select: '_id likes' })
    .exec();

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
        generators,
        software,
        createdAt,
        website,
        location,
        tagline,
        socials,
        _id: userId,
        oauthUsed,
        userSetPassword,
        emailNotifications,
        following,
        followers,
        likes,
        projects,
      } = existingUser;

      res.status(200).json({
        email,
        username,
        displayName,
        avatarUrl,
        bannerUrl,
        summary,
        generators,
        software,
        createdAt,
        website,
        location,
        tagline,
        socials,
        userId,
        token,
        oauthUsed,
        userSetPassword,
        emailNotifications,
        following,
        followers,
        likes,
        projects,
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
        userSetPassword: false,
      });

      const token = createToken(newUser._id);
      const {
        avatarUrl,
        bannerUrl,
        summary,
        generators,
        software,
        createdAt,
        website,
        location,
        tagline,
        socials,
        _id: userId,
        oauthUsed,
        userSetPassword,
        emailNotifications,
        following,
        followers,
        likes,
        projects,
      } = newUser;

      res.status(200).json({
        email,
        username,
        displayName,
        avatarUrl,
        bannerUrl,
        summary,
        generators,
        software,
        userId,
        website,
        location,
        tagline,
        socials,
        createdAt,
        token,
        oauthUsed,
        userSetPassword,
        emailNotifications,
        following,
        followers,
        likes,
        projects,
      });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};

export { loginUser, signupUser, checkEmailOAuth, signUpWithOAuth };
