import { Schema } from 'mongoose';

interface Comment {
  author: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  likes: number;
}

export default Comment;
