import Project from '../models/projectModel.js';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import ProjectDocument from '../types/ProjectDocument.js';
import { uploadImagesToS3 } from '../utility/s3Utils.js';
import ProjectImageData from '../types/ProjectImage.js';
import { checkEmptyProjectFields } from '../utility/validation.utility.js';

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
  const userId = req.user?._id;
  const {
    title,
    description,
    cpu,
    gpu,
    ram,
    commentsAllowed,
    tags,
    softwareList,
    published,
    imageData,
    workflow,
  } = req.body;
  let areCommentsAllowed = true;
  const isPublished = JSON.parse(published);
  const parsedWorkflow = JSON.parse(workflow);
  const workflowImage = (req.files as { workflowImage?: Express.Multer.File[] })
    ?.workflowImage?.[0];
  const projectImages = (req.files as { images?: Express.Multer.File[] })
    ?.images;
  const parsedImageData = JSON.parse(imageData);
  const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];
  const parsedSoftwareList =
    typeof softwareList === 'string'
      ? JSON.parse(softwareList)
      : softwareList || [];

  const hardware = {
    cpu,
    gpu,
    ram,
  };

  if (!commentsAllowed) {
    areCommentsAllowed = false;
  }

  const uploadProjectImagesToS3 = async (
    files: Express.Multer.File[] | undefined
  ) => {
    if (!files || !files.length) return [];

    const uploadPromises = files.map(async (file) => {
      return await uploadImagesToS3(file);
    });

    return Promise.all(uploadPromises);
  };

  const projectImageUrls = await uploadProjectImagesToS3(projectImages);

  const workflowImageUrl = await uploadImagesToS3(workflowImage);

  const imageObject = parsedImageData.map(
    (imageData: ProjectImageData, index: number) => ({
      url: projectImageUrls[index],
      mimeType:
        projectImages && projectImages[index]
          ? projectImages[index].mimetype
          : '',
      size:
        projectImages && projectImages[index] ? projectImages[index].size : 0,
      caption: imageData.caption,
      prompt: imageData.prompt,
      negativePrompt: imageData.negativePrompt,
      seed: imageData.seed,
      steps: imageData.steps,
      model: imageData.model,
      cfgScale: imageData.cfgScale,
      createdAt: new Date(),
      author: userId,
    })
  );

  const emptyFields = checkEmptyProjectFields(
    title,
    description,
    projectImages,
    parsedWorkflow,
    workflowImage,
    parsedSoftwareList,
    parsedTags
  );

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: `Please fill out the missing fields.`,
      emptyFields,
    });
  }

  try {
    const project: ProjectDocument = await Project.create({
      author: userId,
      title,
      description,
      tags: parsedTags,
      softwareList: parsedSoftwareList,
      workflow: parsedWorkflow,
      workflowUrl: workflowImageUrl,
      hardware,
      commentsAllowed: areCommentsAllowed,
      images: imageObject,
      published: isPublished,
    });
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
