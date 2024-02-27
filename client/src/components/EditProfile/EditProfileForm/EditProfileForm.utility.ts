import imageCompression from 'browser-image-compression';

const customFileValidation = (
  file: File,
  allowedFileTypes: string[],
  MAX_IMAGE_SIZE: number,
) => {
  if (!allowedFileTypes.includes(file.type)) {
    return {
      code: 'invalid-file-type',
      message: 'Invalid file type.',
    };
  }

  if (file.size > MAX_IMAGE_SIZE) {
    return {
      code: 'file-too-large',
      message: 'File size exceeds 5MB limit',
    };
  }

  return null;
};

const compressAndSetPreview = async (
  acceptedFiles: File[],
  setPreview: React.Dispatch<React.SetStateAction<string | ArrayBuffer | null>>,
  options: {
    maxSizeKB: number;
    maxWidthOrHeight: number;
    useWebWorker: boolean;
  },
  setCompressedImage: React.Dispatch<React.SetStateAction<File | null>>,
) => {
  try {
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

    const compressedFile = compressedFiles[0];
    setCompressedImage(compressedFile);

    const fileReader = new FileReader();
    fileReader.onload = function () {
      setPreview(fileReader.result);
    };
    fileReader.readAsDataURL(compressedFile);
  } catch (error) {
    console.error('Error compressing files:', error);
  }
};

export { customFileValidation, compressAndSetPreview };
