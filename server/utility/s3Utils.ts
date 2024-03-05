import dotenv from 'dotenv';
import crypto from 'crypto';
import { S3Client } from '@aws-sdk/client-s3';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';

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

export {
  bucketName,
  bucketRegion,
  accessKey,
  secretAccessKey,
  randomImageName,
  s3,
  uploadImagesToS3,
};
