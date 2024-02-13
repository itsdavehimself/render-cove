import express, { Router } from 'express';
import {
  loginUser,
  signupUser,
  signUpWithOAuth,
} from '../controllers/userAuthController.js';

const userAuthRouter: Router = express.Router();

userAuthRouter.post('/login', loginUser);
userAuthRouter.post('/signup', signupUser);
userAuthRouter.post('/google-oauth', signUpWithOAuth);

export default userAuthRouter;
