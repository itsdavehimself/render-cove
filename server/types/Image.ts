import { Schema } from 'mongoose';

interface Image {
  url: string;
  fileName: string;
  mimeType: string;
  size: number;
  caption: string;
  userId: Schema.Types.ObjectId | string;
  createdAt: Date;
  model: string;
  prompt: string;
  negativePrompt: string;
  cfgScale: number;
  steps: number;
  sampler: string;
  seed: number;
}

export default Image;
