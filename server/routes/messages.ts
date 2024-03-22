import express, { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  getMessages,
  sendMessage,
  getConversations,
  markAsRead,
} from '../controllers/messagesController.js';

const messagesRouter: Router = express.Router();

messagesRouter.get('/conversations', requireAuth, getConversations);

messagesRouter.get('/:otherUserId', requireAuth, getMessages);

messagesRouter.patch('/:otherUserId', requireAuth, markAsRead);

messagesRouter.post('/:otherUserId', requireAuth, sendMessage);

export default messagesRouter;
