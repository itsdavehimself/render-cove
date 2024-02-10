import express, { Router } from 'express';
import {
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
} from '../controllers/usersController.js';

const usersRouter: Router = express.Router();

usersRouter.get('/', getAllUsers);

usersRouter.get('/:id', getUser);

usersRouter.delete('/:id', deleteUser);

usersRouter.patch('/:id', updateUser);

export default usersRouter;
