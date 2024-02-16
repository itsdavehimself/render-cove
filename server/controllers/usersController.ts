import User from '../models/userModel.js';
import { UserDocument } from '../types/UserInterfaces';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

interface AuthRequest extends Request {
  user?: { _id: string; username: string };
}

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user: UserDocument | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const allUsers: UserDocument[] = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json(allUsers);
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user: UserDocument | null = await User.findOneAndDelete({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  try {
    if (!userId || userId.toString() !== id) {
      return res.status(403).json({ error: 'Forbidden - Unauthorized User' });
    }

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    if (req.body.username) {
      const newUsername = req.body.username;
      const usernameExists: UserDocument | null = await User.findOne({
        username: newUsername,
      });

      if (usernameExists && newUsername !== usernameExists.username) {
        return res
          .status(400)
          .json({ error: 'Username exists. Please try another username.' });
      }
    }

    const user: UserDocument | null = await User.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { getUser, getAllUsers, deleteUser, updateUser };
