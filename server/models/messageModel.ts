import mongoose, { Schema } from 'mongoose';
import MessageDocument from '../types/MessageDocument';

const messageSchema = new Schema<MessageDocument>({
  recipient: { type: Schema.Types.ObjectId, ref: 'User' },
  sender: { type: Schema.Types.ObjectId, ref: 'User' },
  content: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});

export default mongoose.model<MessageDocument>('Message', messageSchema);
