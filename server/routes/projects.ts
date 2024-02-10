import express, { Router } from 'express';
import {
  getAllProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
} from '../controllers/projectsController.js';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const projectsRouter: Router = express.Router();

projectsRouter.get('/', getAllProjects);

projectsRouter.get('/:id', getProject);

projectsRouter.post('/', upload.single('image'), createProject);

projectsRouter.delete('/:id', deleteProject);

projectsRouter.patch('/:id', updateProject);

export default projectsRouter;
