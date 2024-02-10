import Project from '../models/projectModel.js';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import ProjectDocument from '../types/ProjectDocument.js';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

const bucketName = process.env.BUCKET_NAME as string;
const bucketRegion = process.env.BUCKET_REGION as string;
const accessKey = process.env.ACCESS_KEY as string;
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;

const randomImageName = (bytes: number = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

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

const createProject = async (
  req: Request<{}, {}, ProjectDocument>,
  res: Response
) => {
  const imageName = randomImageName();

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: req.file?.buffer,
    ContentType: req.file?.mimetype,
  };

  const command = new PutObjectCommand(params);

  const s3Url = `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${imageName}`;

  const { author, title, description, tags, softwareList } = req.body;

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
    const project: ProjectDocument = await Project.create({
      author,
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
  createProject,
  deleteProject,
  updateProject,
};
