import { Schema, Types } from 'mongoose';

interface NotificationDocument {
  recipient: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  type: string;
  post: Schema.Types.ObjectId;
  createdAt: Date;
  read: boolean;
}

export default NotificationDocument;
