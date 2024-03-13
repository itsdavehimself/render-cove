import { Request, Response } from 'express';
import User from '../models/userModel.js';
import CollectionDocument from '../types/CollectionDocument.js';
import Collection from '../models/collectionModel.js';
import mongoose from 'mongoose';

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
      public: isPrivate,
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
  const userId = req.user?._id;

  try {
    const allCollections: CollectionDocument[] | null = await Collection.find({
      creator: userId,
    }).sort({
      createdAt: -1,
    });

    res.status(200).json(allCollections);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { getAllUserLikes, createCollection, getCollections };
