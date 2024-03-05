import styles from './MultiImageInput.module.scss';
import {
  FileRejection,
  DropzoneRootProps,
  DropzoneInputProps,
} from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';
import { useEffect, useState } from 'react';

interface MultiImageInputProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  isDragActive: boolean;
  fileRejections: FileRejection[];
  fileSizeLimit: string;
  maxFileCount: number;
  serverError?: string;
}

const MultiImageInput: React.FC<MultiImageInputProps> = ({
  getRootProps,
  getInputProps,
  isDragActive,
  fileRejections,
  fileSizeLimit,
  maxFileCount,
  serverError,
}) => {
  const imageIcon: React.ReactNode = <FontAwesomeIcon icon={faImage} />;
  const [tooManyFilesError, setTooManyFilesError] = useState<string | null>(
    null,
  );

  useEffect(() => {
    if (fileRejections.length > maxFileCount) {
      setTooManyFilesError(
        `Too many files. Maximum number of images allowed is ${maxFileCount}.`,
      );
    }

    if (fileRejections.length < maxFileCount) {
      setTooManyFilesError('');
    }
  }, [fileRejections, maxFileCount]);

  return (
    <div className={styles['image-upload-container']}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div
          className={`${styles['image-upload-box']} ${
            isDragActive ? styles['dragging'] : ''
          } ${serverError ? styles.error : ''}`}
        >
          <div className={styles['image-upload-description']}>
            <div
              className={`${styles['upload-icon']} ${
                isDragActive ? styles['dragging'] : ''
              }`}
            >
              {imageIcon}
            </div>
            <div className={styles['image-upload-main']}>
              {isDragActive ? (
                <p>Drop it like it's hot 🔥</p>
              ) : (
                <p className={styles['image-upload-main']}>
                  Drag image here or click to upload
                </p>
              )}
            </div>
            <p className={styles['image-size-limit']}>{fileSizeLimit}</p>
            {tooManyFilesError && (
              <div className={styles['file-input-error']}>
                {tooManyFilesError}
              </div>
            )}
            {fileRejections.length > 0 && !tooManyFilesError && (
              <div className={styles['file-input-error']}>
                {fileRejections.map(({ errors }) =>
                  errors.map((e) => <div key={e.code}>{e.message}</div>),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      {serverError && (
        <div className={styles['input-error-message']}>{serverError}</div>
      )}
    </div>
  );
};

export default MultiImageInput;
