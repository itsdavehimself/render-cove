import { Types } from 'mongoose';

interface CollectionDocument {
  title: string;
  creator: Types.ObjectId;
  projects: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  private: boolean;
  _id: Types.ObjectId;
}

export default CollectionDocument;
