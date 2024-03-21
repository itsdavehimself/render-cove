import mongoose, { Schema } from 'mongoose';
import MessageDocument from '../types/MessageDocument';

const messageSchema = new Schema<MessageDocument>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User' },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    content: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.model<MessageDocument>('Message', messageSchema);
