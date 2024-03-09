import Project from '../models/projectModel.js';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import ProjectDocument from '../types/ProjectDocument.js';
import { uploadImagesToS3 } from '../utility/s3Utils.js';
import ProjectImageData from '../types/ProjectImage.js';
import { checkEmptyProjectFields } from '../utility/validation.utility.js';
import User from '../models/userModel.js';
import Like from '../types/Like.js';
import Comment from '../types/Comment.js';

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

const getUsersProjects = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const allProjects: ProjectDocument[] = await Project.find({
      author: id,
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
    ram: ram + 'GB RAM',
  };

  if (!commentsAllowed) {
    areCommentsAllowed = false;
  }

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

    await User.findByIdAndUpdate(userId, { $push: { projects: project._id } });
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

const toggleLikeProject = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user?._id;

  try {
    const project: ProjectDocument | null = await Project.findById({
      _id: projectId,
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    if (project.likes.some((like) => like.userId.equals(userId))) {
      const project = await Project.findOneAndUpdate(
        { _id: projectId },
        { $pull: { likes: { userId: userId } } },
        { new: true }
      );

      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $pull: { likes: { projectId: projectId } } },
        { new: true }
      );

      const removeLikeObject = {
        project,
        user,
      };
      res.status(200).json(removeLikeObject);
    } else {
      const project = await Project.findOneAndUpdate(
        { _id: projectId },
        { $addToSet: { likes: { userId: userId } } },
        { new: true }
      );

      const user = await User.findOneAndUpdate(
        { _id: userId },
        { $addToSet: { likes: { projectId: projectId } } },
        { new: true }
      );

      const likeObject = {
        project,
        user,
      };
      res.status(200).json(likeObject);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const addComment = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user?._id;
  const comment = req.body.comment;

  const commentObject = {
    author: userId,
    content: comment,
  };

  try {
    const project: ProjectDocument | null = await Project.findOneAndUpdate(
      { _id: projectId },
      { $push: { comments: commentObject } },
      { new: true }
    );
    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const toggleLikeComment = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user?._id;
  const commentId = req.body.id;

  try {
    const project: ProjectDocument | null = await Project.findById({
      _id: projectId,
    });

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const comment = project.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!comment) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    const likedByUser = comment.likes.some((like) =>
      like.userId.equals(userId)
    );

    if (likedByUser) {
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, 'comments._id': commentId },
        { $pull: { 'comments.$.likes': { userId: userId } } },
        { new: true }
      );

      res.status(200).json(updatedProject);
    } else {
      const updatedProject = await Project.findOneAndUpdate(
        { _id: projectId, 'comments._id': commentId },
        { $addToSet: { 'comments.$.likes': { userId: userId } } },
        { new: true }
      );

      res.status(200).json(updatedProject);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getProject,
  getAllProjects,
  getUsersProjects,
  getAuthUsersProjects,
  createProject,
  deleteProject,
  updateProject,
  incrementViews,
  toggleLikeProject,
  addComment,
  toggleLikeComment,
};
