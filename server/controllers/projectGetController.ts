import { Request, Response } from 'express';
import { Types } from 'mongoose';
import Project from '../models/projectModel.js';
import User from '../models/userModel.js';
import { UserDocument } from '../types/UserDocument.js';
import ProjectDocument from '../types/ProjectDocument.js';

interface AuthRequest extends Request {
  user?: { _id: string };
}

const getProject = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project ID.' });
    }

    const project: ProjectDocument | null = await Project.findById(id);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getFeaturedProjects = async (req: Request, res: Response) => {
  const allProjects: ProjectDocument[] = await Project.find({})
    .sort({
      createdAt: -1,
    })
    .populate({ path: 'author', select: 'username displayName _id avatarUrl' });

  res.status(200).json(allProjects);
};

const getUsersProjects = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  try {
    let user: UserDocument | null;

    if (Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allProjects: ProjectDocument[] = await Project.find({
      author: user._id,
    }).sort({
      createdAt: -1,
    });
    res.status(200).json(allProjects);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getAuthUsersProjects = async (req: AuthRequest, res: Response) => {
  const user_id = req.user?._id;
  const allProjects: ProjectDocument[] = await Project.find({
    author: user_id,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(allProjects);
};

const incrementViews = async (req: Request, res: Response) => {
  const { projectId } = req.params;

  try {
    const project: ProjectDocument | null = await Project.findOneAndUpdate(
      { _id: projectId },
      { $inc: { views: 1 } },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    res.json({ views: project.views });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getProject,
  getFeaturedProjects,
  getUsersProjects,
  getAuthUsersProjects,
  incrementViews,
};
