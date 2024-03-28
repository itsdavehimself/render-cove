import express, { Router } from 'express';
import { getPopularTags } from '../controllers/tagsController.js';

const tagsRouter: Router = express.Router();

tagsRouter.get('/', getPopularTags);

export default tagsRouter;
