import { Types } from 'mongoose';

interface MessageDocument {
  recipient: Types.ObjectId;
  sender: Types.ObjectId;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  read: boolean;
  _id: Types.ObjectId;
}

export default MessageDocument;
