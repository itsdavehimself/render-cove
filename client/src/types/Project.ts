interface Hardware {
  cpu: string;
  gpu: string;
  ram: number;
}

interface Image {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  caption: string;
  userId: string;
  createdAt: Date;
}

interface Like {
  userId: string;
  timestamp: Date;
}

interface Project {
  author: string;
  title: string;
  description?: string;
  tags: string[];
  softwareList: string[];
  workflow: string;
  workflowUrl: string;
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
