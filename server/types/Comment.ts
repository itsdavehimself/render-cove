import { Schema } from 'mongoose';
import Like from './Like';

interface Comment {
  author: Schema.Types.ObjectId;
  content: string;
  createdAt: Date;
  likes: Like[];
  _id: Schema.Types.ObjectId;
}

export default Comment;
