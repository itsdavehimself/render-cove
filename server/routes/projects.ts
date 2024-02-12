import express, { Router } from 'express';
import {
  getAllProjects,
  getProject,
  getUsersProjects,
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

projectsRouter.get('/', requireAuth, getUsersProjects);

projectsRouter.post('/', requireAuth, upload.single('image'), createProject);

projectsRouter.delete('/:id', requireAuth, deleteProject);

projectsRouter.patch('/:id', requireAuth, updateProject);

export default projectsRouter;
