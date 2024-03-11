import { JSONContent } from '@tiptap/react';

export interface Hardware {
  cpu: string;
  gpu: string;
  ram: number;
}

export interface Image {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  caption: string;
  userId: string;
  createdAt: Date;
  prompt: string;
  negativePrompt: string;
  model: string;
  seed: number;
  cfgScale: number;
  steps: number;
  sampler: string;
}

export interface GenerationData {
  prompt: string;
  negativePrompt: string;
  model: string;
  seed: number;
  cfgScale: number;
  steps: number;
  sampler: string;
}

export interface Like {
  userId: string;
  timestamp: Date;
}

interface Comment {
  author: string;
  content: string;
  timestamp: Date;
  likes: Like[];
  _id: string;
}

interface WorkflowImage {
  url: string;
  originalFileName: string;
}

interface Project {
  author: string;
  title: string;
  description?: string;
  tags: string[];
  softwareList: string[];
  workflow: JSONContent;
  workflowImage: WorkflowImage;
  hardware: Hardware;
  likes: Like[];
  comments: Comment[];
  commentsAllowed: boolean;
  views: number;
  images: Image[];
  published: boolean;
  createdAt: Date;
  updatedAt: Date;
  _id: string;
}

export default Project;
