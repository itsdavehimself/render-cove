import { Request, Response } from 'express';
import Message from '../models/messageModel.js';
import { io } from '../server.js';

interface AuthRequest extends Request {
  user?: { _id: string };
}

const getMessages = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const otherUserId = req.params.otherUserId;

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    })
      .populate([
        { path: 'sender', select: 'avatarUrl displayName' },
        { path: 'recipient', select: 'avatarUrl displayName' },
      ])
      .sort({ createdAt: 1 })
      .exec();

    res.status(200).json(messages);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const sendMessage = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const recipientId = req.params.otherUserId;
  const content = req.body.message;

  if (!content) {
    res.status(500).json({ error: 'Message cannot be empty' });
    return;
  }

  if (!recipientId) {
    res.status(500).json({ error: 'Recipient cannot be empty' });
    return;
  }

  if (!userId) {
    res.status(401).json({ error: 'Unauthorized request' });
    return;
  }

  try {
    let message = await Message.create({
      sender: userId,
      recipient: recipientId,
      content: content,
    });

    message = await message.populate([
      { path: 'sender', select: 'avatarUrl displayName' },
      { path: 'recipient', select: 'avatarUrl displayName' },
    ]);

    io.to(recipientId).emit('receive-message', message);
    res.status(200).json(message);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const markAsRead = async (req: AuthRequest, res: Response) => {
  const loggedInUserId = req.user?._id;
  const otherUserId = req.params.otherUserId;

  try {
    const messages = await Message.updateMany(
      { sender: otherUserId, recipient: loggedInUserId },
      { $set: { read: true } }
    );

    res.status(200).json({ message: 'Messages marked as read successfully' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getConversations = async (req: AuthRequest, res: Response) => {
  const loggedInUserId = req.user?._id;

  try {
    const conversations = await Message.aggregate([
      {
        $match: {
          $or: [{ sender: loggedInUserId }, { recipient: loggedInUserId }],
        },
      },
      {
        $sort: { createdAt: -1 },
      },
      {
        $group: {
          _id: {
            $cond: {
              if: { $eq: ['$sender', loggedInUserId] },
              then: '$recipient',
              else: '$sender',
            },
          },
          latestMessage: { $first: '$$ROOT' },
          maxCreatedAt: { $max: '$createdAt' }, // Add this stage to get the latest message's createdAt timestamp
        },
      },
      {
        $lookup: {
          from: 'users',
          localField: '_id',
          foreignField: '_id',
          as: 'userDetails',
        },
      },
      {
        $unwind: '$userDetails',
      },
      {
        $project: {
          _id: '$latestMessage._id',
          sender: '$latestMessage.sender',
          recipient: '$latestMessage.recipient',
          content: '$latestMessage.content',
          read: '$latestMessage.read',
          createdAt: '$latestMessage.createdAt',
          otherUser: {
            avatarUrl: '$userDetails.avatarUrl',
            displayName: '$userDetails.displayName',
            _id: '$userDetails._id',
            username: '$userDetails.username',
          },
          unreadCount: {
            $sum: {
              $cond: [
                {
                  $and: [
                    { $eq: ['$latestMessage.read', false] },
                    { $eq: ['$latestMessage.recipient', loggedInUserId] },
                    { $eq: ['$latestMessage.sender', '$_id'] },
                  ],
                },
                1,
                0,
              ],
            },
          },
          maxCreatedAt: 1,
        },
      },
      {
        $sort: { maxCreatedAt: -1 },
      },
    ]);

    res.status(200).json(conversations);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { getMessages, sendMessage, markAsRead, getConversations };
