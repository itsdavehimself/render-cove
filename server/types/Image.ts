import { Schema } from 'mongoose';

interface Image {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  caption: string;
  userId: Schema.Types.ObjectId | string;
  createdAt: Date;
}

export default Image;
