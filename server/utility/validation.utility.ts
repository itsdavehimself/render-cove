import User from '../models/userModel.js';
import { Request, Response } from 'express';

const validateUsername = async (newUsername: string, res: Response) => {
  const usernameExists = await User.findOne({ username: newUsername });

  if (usernameExists && newUsername !== usernameExists.username) {
    res
      .status(400)
      .json({ error: 'Username exists. Please try another username.' });
    throw new Error('Username already exists. Please try another username.');
  }
};

const checkEmptyProjectFields = (
  title: string,
  description: string,
  projectImages: Express.Multer.File[] | undefined,
  parsedWorkflow: object,
  workflowImage: Express.Multer.File | undefined,
  parsedSoftwareList: string[],
  parsedTags: string[]
): string[] => {
  let emptyFields: string[] = [];

  if (!title) {
    emptyFields.push('title');
  }

  if (!description) {
    emptyFields.push('description');
  }

  if (!projectImages) {
    emptyFields.push('project images');
  }

  if (!parsedWorkflow && !workflowImage) {
    emptyFields.push('workflow');
  }

  if (parsedSoftwareList.length < 1) {
    emptyFields.push('software');
  }

  if (parsedTags.length < 1) {
    emptyFields.push('tags');
  }

  return emptyFields;
};

export { validateUsername, checkEmptyProjectFields };
