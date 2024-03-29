import express, { Router } from 'express';
import { searchProjects } from '../controllers/searchController.js';

const searchRouter: Router = express.Router();

searchRouter.get('/', searchProjects);

export default searchRouter;
