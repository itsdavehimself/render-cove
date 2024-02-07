import express from 'express';
import {
  getAllProjects,
  getProject,
  createProject,
  deleteProject,
  updateProject,
} from '../controllers/projectsController.js';

const projectsRouter = express.Router();

projectsRouter.get('/', getAllProjects);

projectsRouter.get('/:id', getProject);

projectsRouter.post('/', createProject);

projectsRouter.delete('/:id', deleteProject);

projectsRouter.patch('/:id', updateProject);

export default projectsRouter;
