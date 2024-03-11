import dotenv from 'dotenv';
import crypto from 'crypto';
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import ProjectDocument from '../types/ProjectDocument';
import Image from '../types/Image';

dotenv.config();

const bucketName = process.env.BUCKET_NAME as string;
const bucketRegion = process.env.BUCKET_REGION as string;
const accessKey = process.env.ACCESS_KEY as string;
const secretAccessKey = process.env.SECRET_ACCESS_KEY as string;

const randomImageName = (bytes: number = 32) => {
  return crypto.randomBytes(bytes).toString('hex');
};

const s3 = new S3Client({
  region: bucketRegion,
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
});

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

const deleteImagesFromS3 = async (project: ProjectDocument) => {
  const getFileName = (image: Image) => {
    const url = image.url;
    const fileName = url.split('.com/')[1];
    return fileName;
  };

  let allDeleted = true;

  for (const image of project.images) {
    const fileName = getFileName(image);

    const params = {
      Bucket: bucketName,
      Key: fileName,
    };

    const command = new DeleteObjectCommand(params);

    try {
      await s3.send(command);
      console.log(`Deleted image: ${fileName}`);
    } catch (error: any) {
      console.error(`Error deleting image ${fileName}: ${error.message}`);
      allDeleted = false;
    }
  }

  if (project.workflowImage) {
    const workflowFileName = project.workflowImage.url.split('.com/')[1];

    const workflowParams = {
      Bucket: bucketName,
      Key: workflowFileName,
    };

    const workflowCommand = new DeleteObjectCommand(workflowParams);

    try {
      await s3.send(workflowCommand);
      console.log(`Deleted workflowUrl: ${workflowFileName}`);
    } catch (error: any) {
      console.error(
        `Error deleting workflowUrl ${workflowFileName}: ${error.message}`
      );
      allDeleted = false;
    }
  }

  return allDeleted;
};

const deleteExistingImageFromS3 = async (
  imageUrls: string[]
): Promise<boolean> => {
  let allDeleted = true;

  if (imageUrls && imageUrls.length > 0) {
    const getFileName = (imageUrl: string) => {
      const fileName = imageUrl.split('.com/')[1];
      return fileName;
    };

    for (const url of imageUrls) {
      const fileName = getFileName(url);

      const params = {
        Bucket: bucketName,
        Key: fileName,
      };

      const command = new DeleteObjectCommand(params);

      try {
        await s3.send(command);
        console.log(`Deleted image: ${fileName}`);
      } catch (error: any) {
        console.error(`Error deleting image ${fileName}: ${error.message}`);
        allDeleted = false;
      }
    }
  } else {
    allDeleted = false;
  }

  return allDeleted;
};

export {
  bucketName,
  bucketRegion,
  accessKey,
  secretAccessKey,
  randomImageName,
  s3,
  uploadImagesToS3,
  deleteImagesFromS3,
  deleteExistingImageFromS3,
};
