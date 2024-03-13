import express, { Router } from 'express';
import { getAllUserLikes } from '../controllers/collectionsController.js';
import requireAuth from '../middleware/requireAuth.js';

const collectionsRouter: Router = express.Router();

collectionsRouter.get('/likes', requireAuth, getAllUserLikes);

export default collectionsRouter;
