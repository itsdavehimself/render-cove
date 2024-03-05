import express, { Router } from 'express';
import {
  getAllProjects,
  getProject,
  getUsersProjects,
  getAuthUsersProjects,
  createProject,
  deleteProject,
  updateProject,
} from '../controllers/projectsController.js';
import multer from 'multer';
import requireAuth from '../middleware/requireAuth.js';

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const projectsRouter: Router = express.Router();

projectsRouter.get('/all', getAllProjects);

projectsRouter.get('/:id', getProject);

projectsRouter.get('/user/:id', getUsersProjects);

projectsRouter.get('/', requireAuth, getAuthUsersProjects);

projectsRouter.post(
  '/',
  requireAuth,
  upload.fields([
    { name: 'images', maxCount: 6 },
    { name: 'workflowImage', maxCount: 1 },
  ]),
  createProject
);

projectsRouter.delete('/:id', requireAuth, deleteProject);

projectsRouter.patch('/:id', requireAuth, updateProject);

export default projectsRouter;
