import imageCompression from 'browser-image-compression';

const compressImage = async (
  acceptedFiles: (File | null)[],
  options: {
    maxSizeKB: number;
    maxWidthOrHeight: number;
    useWebWorker: boolean;
  },
  setCompressedImage: React.Dispatch<React.SetStateAction<File | null>>,
) => {
  try {
    const file = acceptedFiles[0];

    if (file) {
      try {
        const compressedFile = await imageCompression(file, options);
        setCompressedImage(compressedFile);

        const fileReader = new FileReader();
        fileReader.readAsDataURL(compressedFile);
      } catch (error) {
        console.error('Image compression failed:', error);
        setCompressedImage(file);
      }
    }
  } catch (error) {
    console.error('Error compressing files:', error);
  }
};

export { compressImage };
