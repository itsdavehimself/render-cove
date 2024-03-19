import express, { Router } from 'express';
import requireAuth from '../middleware/requireAuth.js';
import {
  getNotifications,
  markAsRead,
} from '../controllers/notificationsController.js';

const notificationsRouter: Router = express.Router();

notificationsRouter.get('/', requireAuth, getNotifications);

notificationsRouter.patch('/markAsRead', requireAuth, markAsRead);

export default notificationsRouter;
