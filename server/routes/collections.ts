import express, { Router } from 'express';
import {
  getAllUserLikes,
  createCollection,
  getCollections,
} from '../controllers/collectionsController.js';
import requireAuth from '../middleware/requireAuth.js';

const collectionsRouter: Router = express.Router();

collectionsRouter.get('/likes', requireAuth, getAllUserLikes);

collectionsRouter.post('/', requireAuth, createCollection);

collectionsRouter.get('/:userId', getCollections);

export default collectionsRouter;
