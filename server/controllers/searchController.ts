import { Request, Response } from 'express';
import Project from '../models/projectModel.js';
import User from '../models/userModel.js';

const searchProjects = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;
    const sort = req.query.sort as string;
    const filter = req.query.filter as string;

    let results;

    if (filter === 'users') {
      if (sort === 'followers') {
        results = await User.find({ $text: { $search: query } })
          .select(
            'displayName username avatarUrl tagline _id projects followers'
          )
          .sort({ followers: -1 })
          .populate({
            path: 'projects',
            select: 'title',
            populate: {
              path: 'images',
              select: 'url',
            },
          });
      } else if (sort === 'projects') {
        results = await User.find({ $text: { $search: query } })
          .select(
            'displayName username avatarUrl tagline _id projects followers'
          )
          .sort({ projects: -1 })
          .populate({
            path: 'projects',
            select: 'title',
            populate: {
              path: 'images',
              select: 'url',
            },
          });
      } else if (sort === 'recent') {
        results = await User.find({ $text: { $search: query } })
          .select(
            'displayName username avatarUrl tagline _id projects followers'
          )
          .sort({ createdAt: -1 })
          .populate({
            path: 'projects',
            select: 'title',
            populate: {
              path: 'images',
              select: 'url',
            },
          });
      } else {
        results = await User.find({ $text: { $search: query } })
          .select(
            'displayName username avatarUrl tagline _id projects followers'
          )
          .sort({ score: { $meta: 'textScore' } })
          .populate({
            path: 'projects',
            select: 'title',
            populate: {
              path: 'images',
              select: 'url',
            },
          });
      }

      res.status(200).json(results);
      return;
    }

    if (sort === 'likes') {
      results = await Project.find({ $text: { $search: query } })
        .sort({ likes: -1 })
        .populate({
          path: 'author',
          select: 'username displayName _id avatarUrl',
        });
    } else if (sort === 'views') {
      results = await Project.find({ $text: { $search: query } })
        .sort({ views: -1 })
        .populate({
          path: 'author',
          select: 'username displayName _id avatarUrl',
        });
    } else if (sort === 'latest') {
      results = await Project.find({ $text: { $search: query } })
        .sort({ createdAt: -1 })
        .populate({
          path: 'author',
          select: 'username displayName _id avatarUrl',
        });
    } else {
      results = await Project.find({ $text: { $search: query } })
        .sort({ score: { $meta: 'textScore' } })
        .populate({
          path: 'author',
          select: 'username displayName _id avatarUrl',
        });
    }

    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { searchProjects };
