import User from '../models/userModel.js';
import { UserDocument } from '../types/UserInterfaces';
import { Request, Response } from 'express';
import { Types } from 'mongoose';

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

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
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
