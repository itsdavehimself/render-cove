import { Types } from 'mongoose';

interface TagDocument {
  name: string;
  count: number;
  createdAt: Date;
  updatedAt: Date;
  _id: Types.ObjectId;
}

export default TagDocument;
