import { Request, Response } from 'express';
import User from '../models/userModel.js';
import { UserDocument } from '../types/UserDocument.js';

const getFollowers = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const followers: UserDocument | null = await User.findOne({
      username: username,
    })
      .select('followers')
      .populate({ path: 'followers', select: 'username displayName avatarUrl' })
      .exec();

    return res.status(200).json(followers);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

const getFollowing = async (req: Request, res: Response) => {
  const { username } = req.params;

  try {
    const following: UserDocument | null = await User.findOne({
      username: username,
    })
      .select('following')
      .populate({ path: 'following', select: 'username displayName avatarUrl' })
      .exec();

    return res.status(200).json(following);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
};

export { getFollowers, getFollowing };
