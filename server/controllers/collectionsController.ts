import { Request, Response } from 'express';
import User from '../models/userModel.js';
import CollectionDocument from '../types/CollectionDocument.js';
import Collection from '../models/collectionModel.js';
import mongoose, { Types, ObjectId } from 'mongoose';
import { UserDocument } from '../types/UserDocument.js';

interface AuthRequest extends Request {
  user?: { _id: string };
}

const getAllUserLikes = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;

  try {
    const userWithPopulatedLikes = await User.findById(userId)
      .populate({
        path: 'likes.projectId',
        select: 'title images _id',
        match: { published: true },
        populate: {
          path: 'author',
          select: 'avatarUrl username',
        },
      })
      .exec();

    const usersLikes = userWithPopulatedLikes?.likes;

    if (usersLikes) {
      res.status(200).json(usersLikes);
    } else {
      res.status(404).json({ message: 'No likes found for the user' });
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const createCollection = async (req: AuthRequest, res: Response) => {
  const userId = req.user?._id;
  const { projectId, collectionName, isPrivate } = req.body;

  if (!collectionName) {
    return res.status(500).json({ error: { message: 'Missing name' } });
  }

  try {
    const collection: CollectionDocument = await Collection.create({
      title: collectionName,
      creator: userId,
      projects: [projectId],
      private: isPrivate,
    });

    if (collection) {
      await User.findByIdAndUpdate(userId, {
        $push: { collections: collection._id },
      });
    }
    res.status(200).json(collection);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getCollections = async (req: AuthRequest, res: Response) => {
  const { userId } = req.params;

  try {
    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ error: 'Invalid user ID' });
    }

    const allCollections: CollectionDocument[] | null = await Collection.find({
      creator: userId,
    })
      .populate({
        path: 'projects',
        select: 'images title _id',
        match: { published: true },
        populate: {
          path: 'author',
          select: 'avatarUrl username',
        },
      })
      .exec();

    if (!allCollections || allCollections.length === 0) {
      return res
        .status(404)
        .json({ message: 'No collections found for the user' });
    }

    res.status(200).json(allCollections);
  } catch (error: any) {
    console.error('Error fetching collections:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const toggleInCollection = async (req: AuthRequest, res: Response) => {
  const { collectionId } = req.params;
  const { projectId } = req.body;

  try {
    const collection = await Collection.findById(collectionId);

    if (!collection) {
      return res.status(404).json({ error: 'Collection not found' });
    }

    if (!collection.projects.includes(projectId)) {
      collection.projects.push(projectId);
      await collection.save();

      const populatedCollection = await collection.populate({
        path: 'projects',
        select: 'images title _id',
        match: { published: true },
        populate: {
          path: 'author',
          select: 'avatarUrl username',
        },
      });
      res.status(200).json(populatedCollection);
    } else {
      collection.projects = collection.projects.filter(
        (projectObjId) => projectObjId.toString() !== projectId
      );
      await collection.save();
      const populatedCollection = await collection.populate({
        path: 'projects',
        select: 'images title _id',
        match: { published: true },
        populate: {
          path: 'author',
          select: 'avatarUrl username',
        },
      });
      res.status(200).json(populatedCollection);
    }
  } catch (error) {
    console.error('Error adding project to collection:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const deleteCollection = async (req: AuthRequest, res: Response) => {
  const { collectionId } = req.params;
  const userId = req.user?._id;

  const collectionObjectId = new mongoose.Types.ObjectId(collectionId);

  try {
    await Collection.findByIdAndDelete(collectionId);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $pull: { collections: collectionObjectId } },
      { new: true }
    );

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export {
  getAllUserLikes,
  createCollection,
  getCollections,
  toggleInCollection,
  deleteCollection,
};
