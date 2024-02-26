import User from '../models/userModel.js';
import { Request, Response } from 'express';

const validateUsername = async (newUsername: string, res: Response) => {
  const usernameExists = await User.findOne({ username: newUsername });

  if (usernameExists && newUsername !== usernameExists.username) {
    res
      .status(400)
      .json({ error: 'Username exists. Please try another username.' });
    throw new Error('Username already exists. Please try another username.');
  }
};

export { validateUsername };
