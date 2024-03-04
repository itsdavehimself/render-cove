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

export { customFileValidation };
