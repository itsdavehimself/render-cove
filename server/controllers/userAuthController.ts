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
    const displayName = user.displayName;

    res.status(200).json({ email, displayName, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const signupUser = async (req: Request, res: Response): Promise<void> => {
  const { email, password, displayName } = req.body;

  try {
    const user: UserDocument = await User.signup(email, password, displayName);
    const token: string = createToken(user._id);

    res.status(200).json({ email, token });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export { loginUser, signupUser };
