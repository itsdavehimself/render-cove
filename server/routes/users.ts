import express, { Router } from 'express';
import {
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
} from '../controllers/usersController.js';
import requireAuth from '../middleware/requireAuth.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const usersRouter: Router = express.Router();

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', getUser);

usersRouter.delete('/:id', deleteUser);

usersRouter.patch('/:id', requireAuth, upload.none(), updateUser);

export default usersRouter;
