import styles from './MultiImageInput.module.scss';
import {
  FileRejection,
  DropzoneRootProps,
  DropzoneInputProps,
} from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage } from '@fortawesome/free-solid-svg-icons';

interface MultiImageInputProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  isDragActive: boolean;
  fileRejections: FileRejection[];
  fileSizeLimit: string;
}

const MultiImageInput: React.FC<MultiImageInputProps> = ({
  getRootProps,
  getInputProps,
  isDragActive,
  fileRejections,
  fileSizeLimit,
}) => {
  const imageIcon: React.ReactNode = <FontAwesomeIcon icon={faImage} />;

  return (
    <div className={styles['image-upload-container']}>
      <div {...getRootProps()}>
        <input {...getInputProps()} />
        <div
          className={`${styles['image-upload-box']} ${isDragActive ? styles['dragging'] : ''}`}
        >
          <div className={styles['image-upload-description']}>
            <div
              className={`${styles['upload-icon']} ${isDragActive ? styles['dragging'] : ''}`}
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
            {fileRejections.length > 0 && (
              <div className={styles['file-input-error']}>
                {fileRejections.map(({ errors }) =>
                  errors.map((e) => <>{e.message}</>),
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MultiImageInput;
