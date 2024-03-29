import styles from './SingleImageInput.module.scss';
import {
  FileRejection,
  DropzoneRootProps,
  DropzoneInputProps,
} from 'react-dropzone';

interface SingleImageInputProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  isDragActive: boolean;
  imagePreview: string | ArrayBuffer | null;
  fileRejections: FileRejection[];
  fileSizeLimit: string;
  imageContainerClassName?: string;
  imagePreviewClassName?: string;
}

const SingleImageInput: React.FC<SingleImageInputProps> = ({
  getRootProps,
  getInputProps,
  isDragActive,
  imagePreview,
  fileRejections,
  fileSizeLimit,
  imageContainerClassName,
  imagePreviewClassName,
}) => {
  return (
    <div {...getRootProps()}>
      <input {...getInputProps()} />
      <div
        className={`${styles['image-upload-box']} ${isDragActive ? styles['dragging'] : ''}`}
      >
        <div
          className={`${styles['image-container']} ${imageContainerClassName ? styles[imageContainerClassName] : ''}`}
        >
          <img
            className={`${styles['image-preview']} ${imagePreviewClassName ? styles[imagePreviewClassName] : ''}`}
            src={
              typeof imagePreview === 'string'
                ? imagePreview
                : imagePreview instanceof ArrayBuffer
                  ? 'data:image/jpeg;base64,' +
                    Buffer.from(imagePreview).toString('base64')
                  : ''
            }
          ></img>
        </div>
        <div className={styles['image-upload-description']}>
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
  );
};

export default SingleImageInput;
