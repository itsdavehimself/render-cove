import imageCompression from 'browser-image-compression';

interface ImageData {
  image: string | ArrayBuffer | null;
  compressedImage: File;
  caption: string;
}

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
          setImageData((prevImageDatas) => [
            ...prevImageDatas,
            {
              image: fileReader.result,
              compressedImage: compressedFile,
              caption: '',
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

export { compressAndSetPreviewMultiple };
