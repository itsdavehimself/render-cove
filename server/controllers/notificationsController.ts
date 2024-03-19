import { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';
import Notification from '../models/notificationModel.js';

interface AuthRequest extends Request {
  user?: { _id: string };
}

const getNotifications = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;

  try {
    const notifications = await Notification.find({
      recipient: userId,
    })
      .sort({ createdAt: -1 })
      .populate({ path: 'sender', select: 'avatarUrl displayName username' })
      .populate({ path: 'post', select: 'title _id' })
      .exec();

    res.status(200).json(notifications || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;

  try {
    const notifications = await Notification.updateMany(
      { recipient: userId, read: false },
      { $set: { read: true } }
    )
      .populate({ path: 'sender', select: 'avatarUrl displayName' })
      .populate({ path: 'post', select: 'title' })
      .exec();

    res.status(200).json(notifications || []);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { getNotifications, markAsRead };
