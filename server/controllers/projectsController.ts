import Project from '../models/projectModel.js';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import ProjectDocument from '../types/ProjectDocument.js';
import {
  deleteExistingImageFromS3,
  deleteImagesFromS3,
  uploadImagesToS3,
  deleteWorkflowImageFromS3,
} from '../utility/s3Utils.js';
import ProjectImageData from '../types/ProjectImage.js';
import {
  checkEmptyProjectFields,
  checkEmptyProjectFieldsEditing,
} from '../utility/validation.utility.js';
import User from '../models/userModel.js';
import Image from '../types/Image.js';
import { ramValue } from '../utility/value.utility.js';
import { UserDocument } from '../types/UserDocument.js';
import { io } from '../server.js';
import Notification from '../models/notificationModel.js';

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

  let workflowFileName = '';

  if (workflowImage) {
    workflowFileName = workflowImage?.originalname;
  }

  const hardware = {
    cpu,
    gpu,
    ram: ramValue(ram),
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
      sampler: imageData.sampler,
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
      workflowImage: {
        url: workflowImageUrl || '',
        originalFileName: workflowFileName,
      },
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

const deleteProject = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const user_id = req.user?._id;

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

    await deleteImagesFromS3(project);

    await User.findOneAndUpdate(
      { _id: user_id },
      { $pull: { projects: id } },
      { new: true }
    );

    const usersWithLikes = await User.find({ 'likes.projectId': id });

    await Promise.all(
      usersWithLikes.map(async (user) => {
        await User.findByIdAndUpdate(user._id, {
          $pull: { likes: { projectId: id } },
        });
      })
    );

    res.status(200).json(project);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateProject = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
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
    existingImages,
    existingImageData,
    existingWorkflowImage,
  } = req.body;
  const parsedExistingImages = JSON.parse(existingImages);
  const parsedExistingImageData = JSON.parse(existingImageData);
  let areCommentsAllowed = true;
  const isPublished = JSON.parse(published);
  const parsedWorkflow = JSON.parse(workflow);
  const workflowImage = (req.files as { workflowImage?: Express.Multer.File[] })
    ?.workflowImage?.[0];
  const workflowFileName = workflowImage?.originalname;
  const projectImages = (req.files as { images?: Express.Multer.File[] })
    ?.images;
  const parsedImageData = JSON.parse(imageData);
  const parsedTags = typeof tags === 'string' ? JSON.parse(tags) : tags || [];
  const parsedSoftwareList =
    typeof softwareList === 'string'
      ? JSON.parse(softwareList)
      : softwareList || [];
  const parsedExistingWorkflowImage = JSON.parse(existingWorkflowImage);

  const hardware = {
    cpu,
    gpu,
    ram: ramValue(ram),
  };

  if (!commentsAllowed) {
    areCommentsAllowed = false;
  }

  const emptyFields = checkEmptyProjectFieldsEditing(
    title,
    description,
    parsedExistingImages,
    projectImages,
    workflow,
    workflowImage,
    parsedSoftwareList,
    parsedTags,
    parsedExistingWorkflowImage
  );

  if (emptyFields.length > 0) {
    return res.status(400).json({
      error: `Please fill out the missing fields.`,
      emptyFields,
    });
  }

  try {
    if (!Types.ObjectId.isValid(projectId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const project: ProjectDocument | null = await Project.findById({
      _id: projectId,
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found.' });
    }

    const updatedProjectImages = await Project.findById(projectId)
      .lean()
      .then((projectDoc) => {
        return projectDoc?.images.map((image) => {
          const matchingData = parsedExistingImageData.find(
            (data: Image) => data.url === image.url
          );

          if (matchingData) {
            return {
              ...image,
              caption: matchingData.caption,
              model: matchingData.model,
              prompt: matchingData.prompt,
              negativePrompt: matchingData.negativePrompt,
              cfgScale: matchingData.cfgScale,
              steps: matchingData.steps,
              sampler: matchingData.sampler,
              seed: matchingData.seed,
            };
          } else {
            return image;
          }
        });
      });

    await Project.findOneAndUpdate(
      { _id: projectId },
      { $set: { images: updatedProjectImages } },
      { new: true }
    );

    const nonMatchingImages = project.images.filter(
      (image) => !parsedExistingImages.includes(image.url)
    );

    const imagesToDelete = nonMatchingImages.map((image) => image.url);
    const imagesDeletedFromS3 = await deleteExistingImageFromS3(imagesToDelete);

    if (imagesDeletedFromS3) {
      const updatedProject: ProjectDocument | null =
        await Project.findOneAndUpdate(
          { _id: projectId },
          { $pull: { images: { url: { $in: imagesToDelete } } } },
          { new: true }
        );

      if (updatedProject) {
        return res
          .status(200)
          .json({ message: 'Project updated successfully' });
      } else {
        return res
          .status(500)
          .json({ message: 'Error updating project in MongoDB' });
      }
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
        sampler: imageData.sampler,
        model: imageData.model,
        cfgScale: imageData.cfgScale,
        createdAt: new Date(),
        author: userId,
      })
    );

    if (!parsedExistingWorkflowImage) {
      let workflowImageUrl;
      await deleteWorkflowImageFromS3(project);
      if (workflowImage) {
        workflowImageUrl = await uploadImagesToS3(workflowImage);
      }
      const updatedProject: ProjectDocument | null =
        await Project.findOneAndUpdate(
          { _id: projectId },
          {
            $set: {
              workflowImage: {
                url: workflowImageUrl || '',
                originalFileName: workflowFileName || '',
              },
            },
          },
          { new: true }
        );
    }

    const updatedProject: ProjectDocument | null =
      await Project.findOneAndUpdate(
        { _id: projectId },
        {
          $set: {
            title: title,
            description: description,
            workflow: parsedWorkflow,
            softwareList: parsedSoftwareList,
            tags: parsedTags,
            hardware: hardware,
            commentsAllowed: areCommentsAllowed,
            published: isPublished,
          },
          $addToSet: { images: imageObject },
        },
        { new: true }
      );

    res.status(200).json(updatedProject);
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

    const notificationRoom = project?.author.toString();

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

      let notification = await Notification.create({
        recipient: project?.author,
        sender: userId,
        type: 'like',
        post: projectId,
      });

      notification = await notification.populate([
        { path: 'sender', select: 'avatarUrl displayName' },
        { path: 'post', select: 'title' },
      ]);

      io.to(notificationRoom).emit('receive-notification', notification);

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

  if (!comment) {
    return res
      .status(500)
      .json({ error: 'Please type a comment before submitting.' });
  }

  const MAX_COMMENT_LENGTH = 500;

  if (comment.length > MAX_COMMENT_LENGTH) {
    return res
      .status(500)
      .json({ error: 'Comments must be less than 500 characters.' });
  }

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

const deleteComment = async (req: AuthRequest, res: Response) => {
  const { projectId } = req.params;
  const userId = req.user?._id;
  const commentId = req.body.id;

  try {
    const project: ProjectDocument | null = await Project.findById(projectId);

    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }

    const commentToDelete = project.comments.find(
      (comment) => comment._id.toString() === commentId
    );

    if (!commentToDelete) {
      return res.status(404).json({ error: 'Comment not found' });
    }

    if (
      commentToDelete.author.toString() !== userId?.toString() &&
      userId?.toString() !== project.author.toString()
    ) {
      return res.status(403).json({
        error:
          'Unauthorized: You do not have permission to delete this comment',
      });
    }

    const updatedProject = await Project.findByIdAndUpdate(
      projectId,
      { $pull: { comments: { _id: commentId } } },
      { new: true }
    );

    res.status(200).json(updatedProject);
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
  deleteComment,
  toggleLikeComment,
};
