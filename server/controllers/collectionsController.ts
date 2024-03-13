import { Request, Response } from 'express';
import User from '../models/userModel.js';

interface AuthRequest extends Request {
  user?: { _id: string };
}

const getAllUserLikes = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;

  try {
    const userWithPopulatedLikes = await User.findById(userId)
      .populate({
        path: 'likes.projectId',
        select: 'title images _id',
        match: { published: true },
        populate: {
          path: 'author',
          select: 'avatarUrl username',
        },
      })
      .exec();

    const usersLikes = userWithPopulatedLikes?.likes;

    if (usersLikes) {
      res.status(200).json(usersLikes);
    } else {
      res.status(404).json({ message: 'No likes found for the user' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllUserLikes };
