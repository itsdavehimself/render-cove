import mongoose, { Document, Schema } from 'mongoose';
import Image from '../types/Image.js';
import ProjectDocument from '../types/ProjectDocument.js';

const projectSchema = new Schema<ProjectDocument>(
  {
    // author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: false,
      trim: true,
    },
    tags: {
      type: [
        {
          type: String,
        },
      ],
      validate: [arrayLimit, '{PATH} cannot exceed 15 items'],
    },
    softwareList: {
      type: [
        {
          type: String,
        },
      ],
      validate: [arrayLimit, '{PATH} cannot exceed 15 items'],
    },
    likes: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        fileName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        createdAt: { type: Date, required: true },
        // userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
  },
  { timestamps: true }
);

function arrayLimit(val: string[]) {
  return val.length <= 15;
}

export default mongoose.model<ProjectDocument>('Project', projectSchema);
