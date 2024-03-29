import { Request, Response } from 'express';
import Project from '../models/projectModel.js';

const searchProjects = async (req: Request, res: Response) => {
  try {
    const query = req.query.query as string;

    const results = await Project.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    ).sort({ score: { $meta: 'textScore' } });

    console.log(results);

    res.status(200).json(results);
  } catch (error) {
    console.error('Error searching projects:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

export { searchProjects };
