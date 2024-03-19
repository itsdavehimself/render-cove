import express, { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import { getMessages, sendMessage } from '../controllers/messagesController.js';

const messagesRouter: Router = express.Router();

messagesRouter.get('/', requireAuth, getMessages);

messagesRouter.post('/', requireAuth, sendMessage);

export default messagesRouter;
