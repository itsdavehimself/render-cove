import { Schema } from 'mongoose';
import Image from './Image';
import Comment from './Comment';
import Hardware from './Hardware';
import Like from './Like';
import WorkflowImage from './WorkflowImage';

interface ProjectDocument {
  author: Schema.Types.ObjectId;
  title: string;
  description?: string;
  tags: string[];
  softwareList: string[];
  workflow: string;
  workflowImage: WorkflowImage;
  hardware: Hardware;
  likes: Like[];
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
