import { Schema } from 'mongoose';
import Image from './Image';

interface ProjectDocument {
  author: Schema.Types.ObjectId | string;
  title: string;
  description?: string;
  tags: string[];
  softwareList: string[];
  likes: number;
  images: Image[];
  createdAt: Date;
  updatedAt: Date;
}

export default ProjectDocument;
