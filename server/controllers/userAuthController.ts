import { Request, Response } from 'express';
import { User, UserDocument } from '../models/userModel.js';

const loginUser = async (req: Request, res: Response) => {
  res.json({ message: 'login user' });
};

const signupUser = async (req: Request, res: Response) => {
  const { email, password, displayName } = req.body;

  try {
    const user: UserDocument = await User.signup(email, password, displayName);
    res.status(200).json({ email, user });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

export { loginUser, signupUser };
