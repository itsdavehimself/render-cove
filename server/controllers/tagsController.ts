import { Response, Request } from 'express';
import Tag from '../models/tagModel.js';
import TagDocument from '../types/TagDocument.js';

const createOrUpdateTags = async (tags: string[]) => {
  for (const tag of tags) {
    const lowerCaseTag = tag.toLowerCase();
    const existingTag = await Tag.findOne({ name: lowerCaseTag });

    if (existingTag) {
      existingTag.count++;
      await existingTag.save();
    } else {
      await Tag.create({ name: lowerCaseTag, count: 1 });
    }
  }
};

const createTags = async (tags: string[]) => {
  for (const tag of tags) {
    const lowerCaseTag = tag.toLowerCase();
    const existingTag = await Tag.findOne({ name: lowerCaseTag });

    if (!existingTag) {
      await Tag.create({ name: lowerCaseTag, count: 1 });
    }
  }
};

const getPopularTags = async (req: Request, res: Response) => {
  try {
    const popularTags: TagDocument[] = await Tag.find({})
      .sort({ count: -1 })
      .limit(30);

    res.status(200).json(popularTags);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export { createOrUpdateTags, createTags, getPopularTags };
