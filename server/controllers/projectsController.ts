import Project from '../models/projectModel.js';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import ProjectDocument from '../types/ProjectDocument.js';
import {
  bucketName,
  bucketRegion,
  randomImageName,
  s3,
} from '../utility/s3Utils.js';

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

const getAllProjects = async (req: Request, res: Response) => {
  const allProjects: ProjectDocument[] = await Project.find({}).sort({
    createdAt: -1,
  });
  res.status(200).json(allProjects);
};

const getUsersProjects = async (req: AuthRequest, res: Response) => {
  const user_id = req.user?._id;
  const allProjects: ProjectDocument[] = await Project.find({
    author: user_id,
  }).sort({
    createdAt: -1,
  });
  res.status(200).json(allProjects);
};

const createProject = async (req: AuthRequest, res: Response) => {
  const imageName = randomImageName();

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: req.file?.buffer,
    ContentType: req.file?.mimetype,
  };

  const command = new PutObjectCommand(params);

  const s3Url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${imageName}`;

  const { title, description, tags, softwareList } = req.body;

  let emptyFields = [];

  if (!title) {
    emptyFields.push('title');
  }

  if (!req.file) {
    emptyFields.push('image');
  }

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: `Make sure you give your masterpiece a title and add an image to show off your work!`,
      emptyFields,
    });
  }

  const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];
  const parsedSoftwareList =
    typeof softwareList === 'string'
      ? JSON.parse(softwareList)
      : softwareList || [];

  try {
    const user_id = req.user?._id;
    const project: ProjectDocument = await Project.create({
      author: user_id,
      title,
      description,
      tags: parsedTags,
      softwareList: parsedSoftwareList,
      images: [
        {
          url: s3Url,
          fileName: imageName,
          mimeType: req.file?.mimetype || '',
          size: req.file?.size || 0,
          createdAt: Date.now(),
          author: user_id,
        },
      ],
    });
    await s3.send(command);
    res.status(200).json(project);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
};

const deleteProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid project ID.' });
    }

    const project: ProjectDocument | null = await Project.findOneAndDelete({
      _id: id,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const params = {
      Bucket: bucketName,
      Key: project.images[0].fileName,
    };

    const command = new DeleteObjectCommand(params);
    await s3.send(command);

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const project: ProjectDocument | null = await Project.findOneAndUpdate(
      { _id: id },
      { ...req.body },
      { new: true }
    );

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getProject,
  getAllProjects,
  getUsersProjects,
  createProject,
  deleteProject,
  updateProject,
};
