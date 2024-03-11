import express, { Router } from 'express';
import {
  getAllProjects,
  getProject,
  getUsersProjects,
  getAuthUsersProjects,
  createProject,
  deleteProject,
  updateProject,
  incrementViews,
  toggleLikeProject,
  addComment,
  deleteComment,
  toggleLikeComment,
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

projectsRouter.patch('/views/:projectId', incrementViews);

projectsRouter.patch('/like/:projectId', requireAuth, toggleLikeProject);

projectsRouter.patch('/comment/:projectId', requireAuth, addComment);

projectsRouter.delete('/comment/:projectId', requireAuth, deleteComment);

projectsRouter.patch(
  '/comment/like/:projectId',
  requireAuth,
  toggleLikeComment
);

export default projectsRouter;
