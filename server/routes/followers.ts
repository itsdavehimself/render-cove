import express, { Router } from 'express';
import {
  getFollowers,
  getFollowing,
} from '../controllers/followersController.js';

const followersRouter: Router = express.Router();

followersRouter.get('/followers/:username', getFollowers);

followersRouter.get('/following/:username', getFollowing);

export default followersRouter;
