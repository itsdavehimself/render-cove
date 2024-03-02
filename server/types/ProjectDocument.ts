import { Schema } from 'mongoose';
import Image from './Image';
import Comment from './Comment';
import Hardware from './Hardware';

interface ProjectDocument {
  author: Schema.Types.ObjectId;
  title: string;
  description?: string;
  tags: string[];
  softwareList: string[];
  workflow: string;
  workflowUrl: string;
  hardware: Hardware;
  likes: number;
  comments: Comment[];
  commentsAllowed: boolean;
  views: number;
  images: Image[];
  published: Boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

export default ProjectDocument;
