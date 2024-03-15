import express, { Router } from 'express';
import {
  checkEmailOAuth,
  loginUser,
  signupUser,
  signUpWithOAuth,
} from '../controllers/userAuthController.js';

const userAuthRouter: Router = express.Router();

userAuthRouter.post('/login', loginUser);

userAuthRouter.post('/signup', signupUser);

userAuthRouter.post('/google-oauth-check-email', checkEmailOAuth);

userAuthRouter.post('/google-oauth', signUpWithOAuth);

export default userAuthRouter;
