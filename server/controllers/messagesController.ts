import { Request, Response } from 'express';
import Message from '../models/messageModel.js';
import { io } from '../server.js';

interface AuthRequest extends Request {
  user?: { _id: string };
}

const getMessages = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const otherUserId = req.params.otherUserId;
  console.log('userId', userId);
  console.log('otherUserId', otherUserId);

  try {
    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId },
      ],
    }).sort({ updatedAt: 1 });

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
  }

  if (!recipientId) {
    res.status(500).json({ error: 'Recipient cannot be empty' });
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

export { getMessages, sendMessage };
