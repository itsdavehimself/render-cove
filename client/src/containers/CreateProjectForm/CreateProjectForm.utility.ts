import imageCompression from 'browser-image-compression';
import exifr from 'exifr';
import ImageData from '../../types/ImageData';
const promptRegex = /^[^\r\n]*/;
const negativePromptRegex = /(?<=Negative prompt: )[\s\S]*(?=\W\s\r?\nSteps)/;
const stepsRegex = /(?<=Steps: )[\s\S]*(?=\W\sSampler)/;
const samplerRegex = /(?<=Sampler: )[\s\S]*(?=\W\sCFG)/;
const cfgScaleRegex = /(?<=CFG scale: )[\s\S]*(?=\W\sSeed)/;
const seedRegex = /(?<=Seed: )[\s\S]*(?=\W\sSize)/;
const modelRegex = /(?<=Model: )[\s\S]+?(?=\W\s(?:Denoising|Clip)|$)/;

const getImageMetadata = async (acceptedFiles: File[]) => {
  const metadata = await Promise.all(
    acceptedFiles.map(async (file) => {
      try {
        const rawMetadata = await exifr.parse(file);

        if (rawMetadata && rawMetadata.parameters) {
          const parameters = rawMetadata.parameters;

          const promptArr = parameters.match(promptRegex);
          const prompt = promptArr ? promptArr.join('').trim() : '';

          const negativePromptArr = parameters.match(negativePromptRegex);
          const negativePrompt = negativePromptArr
            ? negativePromptArr.join('')
            : '';

          const stepsArr = parameters.match(stepsRegex);
          const steps = stepsArr ? parseInt(stepsArr.join(''), 10) : 0;

          const samplerArr = parameters.match(samplerRegex);
          const sampler = samplerArr ? samplerArr.join('') : '';

          const cfgScaleArr = parameters.match(cfgScaleRegex);
          const cfgScale = cfgScaleArr ? parseInt(cfgScaleArr.join(''), 10) : 0;

          const seedArr = parameters.match(seedRegex);
          const seed = seedArr ? parseInt(seedArr.join(''), 10) : 0;

          const modelArr = parameters.match(modelRegex);
          const model = modelArr ? modelArr.join('') : '';

          return {
            prompt,
            negativePrompt,
            steps,
            sampler,
            cfgScale,
            seed,
            model,
          };
        } else {
          return {
            model: '',
            prompt: '',
            negativePrompt: '',
            cfgScale: 0,
            steps: 0,
            sampler: '',
            seed: 0,
          };
        }
      } catch (error) {
        console.error(`Failed to get metadata for file ${file.name}:`, error);
        throw error;
      }
    }),
  );

  return metadata;
};

const compressAndSetPreviewMultiple = async (
  acceptedFiles: File[],
  setImageData: React.Dispatch<React.SetStateAction<ImageData[]>>,
  options: {
    maxSizeMB: number;
    maxWidthOrHeight: number;
    useWebWorker: boolean;
  },
  setCompressedImages: React.Dispatch<React.SetStateAction<File[] | undefined>>,
) => {
  try {
    const metadata = await getImageMetadata(acceptedFiles);

    const compressedFiles = await Promise.all(
      acceptedFiles.map(async (file) => {
        try {
          return await imageCompression(file, options);
        } catch (error) {
          console.error('Image compression failed:', error);
          return file;
        }
      }),
    );

    setCompressedImages((prevCompressedImages) => {
      if (prevCompressedImages === undefined) {
        return compressedFiles;
      } else {
        return [...prevCompressedImages, ...compressedFiles];
      }
    });

    const imageMetadata = compressedFiles.map((_, index) => ({
      caption: '',
      model: metadata[index].model,
      prompt: metadata[index].prompt,
      negativePrompt: metadata[index].negativePrompt,
      cfgScale: metadata[index].cfgScale,
      steps: metadata[index].steps,
      sampler: metadata[index].sampler,
      seed: metadata[index].seed,
    }));

    setImageData((prevImageData) => [...prevImageData, ...imageMetadata]);
  } catch (error) {
    console.error('Error compressing files:', error);
  }
};

export { compressAndSetPreviewMultiple };
