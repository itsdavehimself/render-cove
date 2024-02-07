import express from 'express';
import {
  getUser,
  getAllUsers,
  createUser,
  deleteUser,
  updateUser,
} from '../controllers/usersController.js';

const usersRouter = express.Router();

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', getUser);

usersRouter.post('/', createUser);

usersRouter.delete('/:id', deleteUser);

usersRouter.patch('/:id', updateUser);

export default usersRouter;
