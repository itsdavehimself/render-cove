import mongoose, { Schema } from 'mongoose';
import CollectionDocument from '../types/CollectionDocument';

const collectionSchema = new Schema<CollectionDocument>(
  {
    title: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    projects: [{ type: Schema.Types.ObjectId, ref: 'Projects' }],
    private: { type: Boolean, required: true, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<CollectionDocument>(
  'Collection',
  collectionSchema
);
