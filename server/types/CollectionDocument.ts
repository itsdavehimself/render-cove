import { Types } from 'mongoose';

interface CollectionDocument {
  title: string;
  creator: Types.ObjectId;
  projects: Types.ObjectId[];
  createdAt: Date;
  public: boolean;
}

export default CollectionDocument;
