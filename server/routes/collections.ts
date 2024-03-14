import express, { Router } from 'express';
import {
  getAllUserLikes,
  createCollection,
  getCollections,
  toggleInCollection,
} from '../controllers/collectionsController.js';
import requireAuth from '../middleware/requireAuth.js';

const collectionsRouter: Router = express.Router();

collectionsRouter.get('/likes', requireAuth, getAllUserLikes);

collectionsRouter.post('/', requireAuth, createCollection);

collectionsRouter.get('/:userId', getCollections);

collectionsRouter.patch('/:collectionId', requireAuth, toggleInCollection);

export default collectionsRouter;
