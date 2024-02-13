import { Schema } from 'mongoose';
import Image from './Image';
import Comment from './Comment';

interface ProjectDocument {
  author: Schema.Types.ObjectId;
  title: string;
  description?: string;
  tags: string[];
  softwareList: string[];
  likes: number;
  comments: Comment[];
  images: Image[];
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

export default ProjectDocument;
