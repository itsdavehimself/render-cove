import mongoose, { Schema } from 'mongoose';
import TagDocument from '../types/TagDocument';

const tagSchema = new Schema<TagDocument>(
  {
    name: { type: String, required: true },
    count: { type: Number, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<TagDocument>('Tag', tagSchema);
