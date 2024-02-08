import { Schema } from 'mongoose';

interface Image {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  userId: Schema.Types.ObjectId | string;
  createdAt: Date;
}

export default Image;
