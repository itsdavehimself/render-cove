import express, { Router } from 'express';
import {
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  updateUserEmail,
  updateUserPassword,
} from '../controllers/usersController.js';
import requireAuth from '../middleware/requireAuth.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const usersRouter: Router = express.Router();

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', getUser);

usersRouter.delete('/:id', requireAuth, deleteUser);

usersRouter.patch(
  '/:id',
  requireAuth,
  upload.fields([
    { name: 'avatarFile', maxCount: 1 },
    { name: 'bannerFile', maxCount: 1 },
  ]),
  updateUser
);

usersRouter.patch('/updateEmail/:id', requireAuth, updateUserEmail);

usersRouter.patch('/updatePassword/:id', requireAuth, updateUserPassword);

export default usersRouter;
