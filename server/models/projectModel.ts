import mongoose, { Document, Schema } from 'mongoose';

interface Project {
  author: Schema.Types.ObjectId | string;
  title: string;
  description?: string;
  tags: string[];
  software: string[];
  likes: number;
  createdAt: Date;
}

export interface ProjectDocument extends Project, Document {}

const projectSchema = new Schema<ProjectDocument>({
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: false,
  },
  tags: [{ type: String, required: true }],
  software: [{ type: String, required: true }],
  likes: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model<ProjectDocument>('Project', projectSchema);
