interface ImageData {
  image: string | ArrayBuffer | null;
  compressedImage: File;
  caption: string;
  model: string;
  prompt: string;
  negativePrompt: string;
  cfgScale: number;
  steps: number;
  sampler: string;
  seed: number;
}

export default ImageData;
