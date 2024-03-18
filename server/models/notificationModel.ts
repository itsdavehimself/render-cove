import mongoose, { Schema } from 'mongoose';
import NotificationDocument from '../types/NotificationDocument';

const notificationSchema = new Schema<NotificationDocument>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  type: { type: String },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.model<NotificationDocument>(
  'Notification',
  notificationSchema
);
