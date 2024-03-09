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
      type: Schema.Types.Mixed,
      required: true,
      trim: true,
    },
    workflowUrl: {
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
    likes: [
      {
        userId: { type: Schema.Types.ObjectId, ref: 'User' },
        timestamp: { type: Date, default: Date.now },
      },
    ],
    comments: [
      {
        author: Schema.Types.ObjectId,
        content: String,
        likes: [
          {
            userId: { type: Schema.Types.ObjectId, ref: 'User' },
            timestamp: { type: Date, default: Date.now },
          },
        ],
        timestamp: { type: Date, default: Date.now },
      },
    ],
    commentsAllowed: { type: Boolean, default: false },
    views: { type: Number, default: 0 },
    images: [
      {
        url: { type: String, required: true },
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
    published: { type: Boolean, default: false },
  },
  { timestamps: true }
);

function arrayLimit(val: string[]) {
  return val.length <= 15;
}

export default mongoose.model<ProjectDocument>('Project', projectSchema);
