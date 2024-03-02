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
    maxSizeKB: number;
    maxWidthOrHeight: number;
    useWebWorker: boolean;
  },
  setCompressedImages: React.Dispatch<React.SetStateAction<File[] | undefined>>,
) => {
  const metadata = await getImageMetadata(acceptedFiles);

  try {
    const processFileAtIndex = async (index: number) => {
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

      setCompressedImages((prevCompressedImages) => [
        ...(prevCompressedImages || []),
        ...compressedFiles,
      ]);

      if (index < compressedFiles.length) {
        const compressedFile = compressedFiles[index];
        const fileReader = new FileReader();

        fileReader.onload = function () {
          setImageData((prevImageData) => [
            ...prevImageData,
            {
              image: fileReader.result,
              compressedImage: compressedFile,
              caption: '',
              model: metadata[index].model,
              prompt: metadata[index].prompt,
              negativePrompt: metadata[index].negativePrompt,
              cfgScale: metadata[index].cfgScale,
              steps: metadata[index].steps,
              sampler: metadata[index].sampler,
              seed: metadata[index].seed,
            },
          ]);
          processFileAtIndex(index + 1);
        };

        fileReader.readAsDataURL(compressedFile);
      }
    };

    processFileAtIndex(0);
  } catch (error) {
    console.error('Error compressing files:', error);
  }
};

const setCPUHandler = (
  value: string,
  setHardware: React.Dispatch<React.SetStateAction<string>>,
) => {
  setHardware((prevHardware) => ({
    ...prevHardware,
    CPU: value,
  }));
};

const setGPUHandler = (value: string) => {
  setHardware((prevHardware) => ({
    ...prevHardware,
    GPU: value,
  }));
};

const setRAMHandler = (value: string) => {
  setHardware((prevHardware) => ({
    ...prevHardware,
    RAM: parseInt(value) || 0,
  }));
};

export { compressAndSetPreviewMultiple };
