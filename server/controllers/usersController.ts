import User from '../models/userModel.js';
import { UserDocument } from '../types/UserInterfaces';
import { Request, Response } from 'express';
import { Types } from 'mongoose';
import { uploadImagesToS3 } from '../utility/s3Utils.js';
import bcrypt from 'bcrypt';
import { EmailNotifications } from '../types/EmailNotifications.js';
import { validateUsername } from '../utility/validation.utility.js';

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
    userSetPassword: boolean;
    emailNotifications: EmailNotifications;
  };
}

const getUser = async (req: Request, res: Response) => {
  const { identifier } = req.params;

  try {
    let user: UserDocument | null;

    if (Types.ObjectId.isValid(identifier)) {
      user = await User.findById(identifier);
    } else {
      user = await User.findOne({ username: identifier });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const {
      email,
      username,
      displayName,
      avatarUrl,
      bannerUrl,
      summary,
      generators,
      software,
      socials,
      location,
      tagline,
      website,
      createdAt,
      following,
      followers,
      projects,
      _id,
      likes,
    } = user;

    const userResponseObject = {
      email,
      username,
      displayName,
      avatarUrl,
      bannerUrl,
      summary,
      generators,
      software,
      socials,
      location,
      tagline,
      website,
      createdAt,
      following,
      followers,
      projects,
      likes,
      _id,
    };

    res.status(200).json(userResponseObject);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const getAllUsers = async (req: Request, res: Response) => {
  const allUsers: UserDocument[] = await User.find({}).sort({ createdAt: -1 });
  res.status(200).json(allUsers);
};

const deleteUser = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;

  try {
    if (!userId || userId.toString() !== id) {
      return res.status(403).json({ error: 'Forbidden - Unauthorized User' });
    }
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
  const currentEmailNotifications = req.user?.emailNotifications;
  const { software, generators } = req.body;
  const avatarFile = (req.files as { avatarFile?: Express.Multer.File[] })
    ?.avatarFile?.[0];
  const bannerFile = (req.files as { bannerFile?: Express.Multer.File[] })
    ?.bannerFile?.[0];
  const newSocials = req.body.socials;
  const emailNotifications = req.body?.emailNotifications;
  const parsedEmailNotifications =
    emailNotifications === undefined
      ? currentEmailNotifications
      : JSON.parse(emailNotifications);

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
      emailNotifications: parsedEmailNotifications,
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

const updateUserInDatabase = async (id: string, data: any) => {
  return await User.findOneAndUpdate({ _id: id }, data, {
    new: true,
    select: '-password',
  });
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

const updateUserEmail = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const newEmail = req.body.email;
  const enteredPassword = req.body.password;

  try {
    if (!userId || userId.toString() !== id) {
      return res.status(403).json({ error: 'Forbidden - Unauthorized User' });
    }
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const emailExists: UserDocument | null = await User.findOne({
      email: newEmail,
    });

    if (emailExists) {
      return res
        .status(400)
        .json({ error: { message: 'Email already in use.' } });
    }

    const user: UserDocument | null = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    const storedHashedPassword = user.password;

    const isPasswordMatch = await bcrypt.compare(
      enteredPassword,
      storedHashedPassword
    );

    if (!isPasswordMatch) {
      return res
        .status(401)
        .json({ error: { type: 'password', message: 'Incorrect password.' } });
    }

    const newEmailObject = {
      email: newEmail,
    };

    const updatedUser = await updateUserInDatabase(userId, newEmailObject);

    res.status(200).json(updatedUser);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserPassword = async (req: AuthRequest, res: Response) => {
  const { id } = req.params;
  const userId = req.user?._id;
  const isSetPassword = req.user?.userSetPassword;
  const enteredPassword = req.body.currentPassword;
  const newPassword = req.body.newPassword;

  try {
    if (!userId || userId.toString() !== id) {
      return res.status(403).json({ error: 'Forbidden - Unauthorized User' });
    }
    if (!Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const user: UserDocument | null = await User.findOne({ _id: id });

    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    if (isSetPassword) {
      const storedHashedPassword = user.password;

      const isPasswordMatch = await bcrypt.compare(
        enteredPassword,
        storedHashedPassword
      );

      if (!isPasswordMatch) {
        return res.status(401).json({
          error: { type: 'password', message: 'Incorrect password.' },
        });
      }

      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      const newPasswordObject = {
        password: newHashedPassword,
      };

      const updatedUser = await updateUserInDatabase(userId, newPasswordObject);

      res.status(200).json(updatedUser);
    } else {
      const salt = await bcrypt.genSalt(10);
      const newHashedPassword = await bcrypt.hash(newPassword, salt);

      const newPasswordObject = {
        password: newHashedPassword,
        userSetPassword: true,
      };

      const updatedUser = await updateUserInDatabase(userId, newPasswordObject);

      res.status(200).json(updatedUser);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

const toggleFollowStatus = async (req: AuthRequest, res: Response) => {
  const { id: userToToggleId } = req.params;
  const userId = req.user?._id;
  const action = req.body.followAction;

  try {
    if (!Types.ObjectId.isValid(userToToggleId)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }

    const userToToggle: UserDocument | null = await User.findOne({
      _id: userToToggleId,
    });

    if (!userToToggle) {
      return res.status(404).json({
        error: { message: 'User not found' },
      });
    }

    const updateActionToggledUser =
      action === 'follow'
        ? { $addToSet: { followers: userId } }
        : { $pull: { followers: userId } };

    const updateActionUser =
      action === 'follow'
        ? { $addToSet: { following: userToToggleId } }
        : { $pull: { following: userToToggleId } };

    const toggledUser = await User.findOneAndUpdate(
      { _id: userToToggleId },
      updateActionToggledUser,
      { new: true }
    );

    const updatedUser = await User.findOneAndUpdate(
      { _id: userId },
      updateActionUser,
      { new: true }
    );

    const usersObject = {
      toggledUser,
      updatedUser,
    };

    res.status(200).json(usersObject);
  } catch (error: any) {
    console.error('Error in updateUser:', error);
    res.status(500).json({ error: error.message });
  }
};

export {
  getUser,
  getAllUsers,
  deleteUser,
  updateUser,
  updateUserEmail,
  updateUserPassword,
  toggleFollowStatus,
};
