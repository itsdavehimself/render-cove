import dotenv from 'dotenv';
import crypto from 'crypto';
import { S3Client } from '@aws-sdk/client-s3';

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

export {
  bucketName,
  bucketRegion,
  accessKey,
  secretAccessKey,
  randomImageName,
  s3,
};
