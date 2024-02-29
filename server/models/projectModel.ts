import mongoose, { Document, Schema } from 'mongoose';
import ProjectDocument from '../types/ProjectDocument.js';

const projectSchema = new Schema<ProjectDocument>(
  {
    author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
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
    workflow: {
      type: String,
      required: true,
      trim: true,
    },
    workflowUrl: {
      type: String,
      trim: true,
    },
    postProcessing: {
      type: String,
      trim: true,
    },
    hardware: {
      cpu: {
        type: String,
        trim: true,
      },
      gpu: {
        type: String,
        trim: true,
      },
      ram: {
        type: String,
        trim: true,
      },
    },
    challenges: {
      type: String,
      trim: true,
    },
    likes: { type: Number, default: 0 },
    comments: [
      {
        author: Schema.Types.ObjectId,
        content: String,
        likes: Number,
      },
    ],
    views: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
        fileName: { type: String, required: true },
        mimeType: { type: String, required: true },
        size: { type: Number, required: true },
        caption: { type: String, trim: true },
        prompt: { type: String, trim: true },
        negativePrompt: { type: String, trim: true },
        seed: { type: Number, trim: true, default: undefined },
        steps: { type: Number, trim: true, default: undefined },
        model: { type: String, trim: true },
        cfgScale: { type: Number, trim: true, default: undefined },
        createdAt: { type: Date, required: true },
        author: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      },
    ],
  },
  { timestamps: true }
);

function arrayLimit(val: string[]) {
  return val.length <= 15;
}

export default mongoose.model<ProjectDocument>('Project', projectSchema);
