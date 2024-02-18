import imageCompression from 'browser-image-compression';

const addTag = (
  e: React.KeyboardEvent<HTMLInputElement>,
  setTagList: React.Dispatch<React.SetStateAction<string[]>>,
  tagList: string[],
  setInputWidth: React.Dispatch<React.SetStateAction<number>>,
): void => {
  const inputValue: string = e.currentTarget.value.trim();

  if (inputValue !== '') {
    const tagValue: string = e.currentTarget.value.replace(/,/g, '').trim();

    if (tagValue !== '') {
      setTagList([...tagList, tagValue]);
      e.currentTarget.value = '';
      setInputWidth(1);
    }
  }
};

const removeTag = (
  indexToRemove: number,
  setTagList: React.Dispatch<React.SetStateAction<string[]>>,
  tagList: string[],
): void => {
  setTagList(tagList.filter((_, index) => index !== indexToRemove));
};

const handleInputChange = (
  inputRef: React.MutableRefObject<HTMLInputElement | null>,
  setInputWidth: React.Dispatch<React.SetStateAction<number>>,
): void => {
  if (inputRef.current) {
    setInputWidth(inputRef.current.value.length);
  }
};

const handleInputClick = (
  inputRef: React.MutableRefObject<HTMLInputElement | null>,
): void => {
  if (inputRef.current) {
    inputRef.current.focus();
  }
};

const preventEnterKeySubmission = (
  e: React.KeyboardEvent<HTMLFormElement>,
): void => {
  const target = e.target as HTMLInputElement | HTMLTextAreaElement;
  if (e.key === 'Enter' && !['TEXTAREA', 'BUTTON'].includes(target.tagName)) {
    e.preventDefault();
  }
};

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

    const fileReader = new FileReader();
    fileReader.onload = function () {
      setPreview(fileReader.result);
    };
    fileReader.readAsDataURL(compressedFile);
  } catch (error) {
    console.error('Error compressing files:', error);
  }
};

export {
  addTag,
  removeTag,
  handleInputChange,
  handleInputClick,
  preventEnterKeySubmission,
  customFileValidation,
  compressAndSetPreview,
};
