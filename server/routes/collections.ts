import express, { Router } from 'express';
import {
  getAllUserLikes,
  createCollection,
  getCollections,
  toggleInCollection,
  deleteCollection,
  updateCollection,
} from '../controllers/collectionsController.js';
import requireAuth from '../middleware/requireAuth.js';

const collectionsRouter: Router = express.Router();

collectionsRouter.get('/likes', requireAuth, getAllUserLikes);

collectionsRouter.post('/', requireAuth, createCollection);

collectionsRouter.get('/:identifier', getCollections);

collectionsRouter.patch('/:collectionId', requireAuth, toggleInCollection);

collectionsRouter.delete('/:collectionId', requireAuth, deleteCollection);

collectionsRouter.patch('/update/:collectionId', requireAuth, updateCollection);

export default collectionsRouter;
