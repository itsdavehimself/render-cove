import { Schema, Types } from 'mongoose';

interface NotificationDocument {
  recipient: Schema.Types.ObjectId;
  sender: Schema.Types.ObjectId;
  type: string;
  createdAt: Date;
  read: boolean;
}

export default NotificationDocument;
