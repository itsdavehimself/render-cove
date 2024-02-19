import User from '../models/userModel.js';
import { UserDocument } from '../types/UserInterfaces';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import {
  bucketName,
  bucketRegion,
  randomImageName,
  s3,
} from '../utility/s3Utils.js';

export interface SocialEntry {
  network: string;
  username: string;
}

interface AuthRequest extends Request {
  user?: {
    _id: string;
    username: string;
    avatarUrl: string;
    bannerUrl: string;
    socials: SocialEntry[];
  };
}

const getUser = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user: UserDocument | null = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const allUsers: UserDocument[] = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json(allUsers);
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user: UserDocument | null = await User.findOneAndDelete({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(user);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const currentAvatarUrl = req.user?.avatarUrl;
  const currentBannerUrl = req.user?.bannerUrl;
  const currentSocials = req.user?.socials;
  const { software, generators } = req.body;
  const avatarFile = (req.files as { avatarFile?: Express.Multer.File[] })
    ?.avatarFile?.[0];
  const bannerFile = (req.files as { bannerFile?: Express.Multer.File[] })
    ?.bannerFile?.[0];
  const newSocials = req.body.socials;

  const updatedSocials = updateSocials(currentSocials, newSocials);

  const parsedSoftwareList =
    typeof software === 'string' ? JSON.parse(software) : software;

  const parsedGeneratorsList =
    typeof generators === 'string' ? JSON.parse(generators) : generators;

  try {
    if (!userId || userId.toString() !== id) {
      return res.status(403).json({ error: 'Forbidden - Unauthorized User' });
    }

    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    if (req.body.username) {
      await validateUsername(req.body.username, res);
    }

    const updatedAvatarUrl = avatarFile
      ? await uploadImagesToS3(avatarFile)
      : null;
    const updatedBannerUrl = bannerFile
      ? await uploadImagesToS3(bannerFile)
      : null;

    const updateObject: any = {
      ...req.body,
      socials: updatedSocials,
      avatarUrl: updatedAvatarUrl || currentAvatarUrl,
      bannerUrl: updatedBannerUrl || currentBannerUrl,
    };

    if (parsedSoftwareList !== undefined) {
      updateObject.software = parsedSoftwareList;
    }

    if (parsedGeneratorsList !== undefined) {
      updateObject.generators = parsedGeneratorsList;
    }

    const updatedUser = await updateUserInDatabase(id, updateObject);

    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found.' });
    }

    res.status(200).json(updatedUser);
  } catch (error: any) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ error: error.message });
  }
};

const validateUsername = async (newUsername: string, res: Response) => {
  const usernameExists = await User.findOne({ username: newUsername });

  if (usernameExists && newUsername !== usernameExists.username) {
    res
      .status(400)
      .json({ error: 'Username exists. Please try another username.' });
    throw new Error('Username already exists. Please try another username.');
  }
};

const uploadImagesToS3 = async (file: Express.Multer.File | undefined) => {
  if (!file) return;

  const imageName = randomImageName();

  const params = {
    Bucket: bucketName,
    Key: imageName,
    Body: file.buffer,
    ContentType: file.mimetype,
  };

  const command = new PutObjectCommand(params);

  try {
    await s3.send(command);
    return `https://${bucketName}.s3.${bucketRegion}.amazonaws.com/${imageName}`;
  } catch (error) {
    console.error('Error uploading to S3:', error);
    throw new Error('Failed to upload to S3');
  }
};

const updateUserInDatabase = async (id: string, data: any) => {
  return await User.findOneAndUpdate({ _id: id }, data, { new: true });
};

const updateSocials = (
  currentSocials: SocialEntry[] | undefined,
  newSocials: SocialEntry[]
) => {
  let currentSocialsMap = new Map(
    currentSocials ? currentSocials.map((obj) => [obj.network, obj]) : []
  );

  if (!newSocials) {
    return currentSocials;
  }

  newSocials.forEach((newObj: SocialEntry) => {
    if (currentSocials && currentSocialsMap.has(newObj.network)) {
      const index = currentSocials.findIndex(
        (obj) => obj.network === newObj.network
      );
      if (index !== -1) {
        currentSocials[index] = newObj;
      }
    } else {
      if (currentSocials) {
        currentSocials.push(newObj);
      }
    }
  });

  return currentSocials;
};

export { getUser, getAllUsers, deleteUser, updateUser };
