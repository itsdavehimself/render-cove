import express, { Router } from 'express';
import { loginUser, signupUser } from '../controllers/userAuthController.js';

const userAuthRouter: Router = express.Router();

userAuthRouter.post('/login', loginUser);
userAuthRouter.post('/signup', signupUser);

export default userAuthRouter;
