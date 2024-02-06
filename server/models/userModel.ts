import mongoose, { Document, Schema } from 'mongoose';

interface User {
  email: string;
  password: string;
  displayName: string;
  summary?: string;
  skills?: string[];
}

export interface UserDocument extends User, Document {}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<UserDocument>('User', userSchema);
