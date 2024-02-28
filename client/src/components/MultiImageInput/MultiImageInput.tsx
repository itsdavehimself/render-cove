import styles from './MultiImageInput.module.scss';
import {
  FileRejection,
  DropzoneRootProps,
  DropzoneInputProps,
} from 'react-dropzone';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faImage, faXmark } from '@fortawesome/free-solid-svg-icons';

interface ImageData {
  image: string | ArrayBuffer | null;
  compressedImage: File;
  caption: string;
}

interface MultiImageInputProps {
  getRootProps: <T extends DropzoneRootProps>(props?: T | undefined) => T;
  getInputProps: <T extends DropzoneInputProps>(props?: T | undefined) => T;
  isDragActive: boolean;
  imageData: ImageData[];
  setImageData: React.Dispatch<React.SetStateAction<ImageData[]>>;
  fileRejections: FileRejection[];
  fileSizeLimit: string;
}

const MultiImageInput: React.FC<MultiImageInputProps> = ({
  getRootProps,
  getInputProps,
  isDragActive,
  imageData,
  setImageData,
  fileRejections,
  fileSizeLimit,
}) => {
  const deleteIcon: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;
  const imageIcon: React.ReactNode = <FontAwesomeIcon icon={faImage} />;

  const handleDeleteImage = (indexToRemove: number): void => {
    setImageData((prevImageData) =>
      prevImageData.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleCaptionChange = (index: number, newCaption: string): void => {
    setImageData((prevImageData) =>
      prevImageData.map((data, i) =>
        i === index ? { ...data, caption: newCaption } : data,
      ),
    );
  };

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
      {imageData.length > 0 && (
        <div className={styles['preview-cards-container']}>
          {imageData.map((data, index) => (
            <div className={styles['preview-card']} key={index}>
              <div className={styles['image-container']}>
                <img
                  className={`${styles['image-preview']}`}
                  src={
                    typeof data.image === 'string'
                      ? data.image
                      : data.image instanceof ArrayBuffer
                        ? 'data:image/jpeg;base64,' +
                          Buffer.from(data.image).toString('base64')
                        : ''
                  }
                />
                <div className={styles['card-top-bar']}>
                  <button
                    type="button"
                    className={styles['trash-button']}
                    onClick={() => handleDeleteImage(index)}
                  >
                    {deleteIcon}
                  </button>
                </div>
              </div>
              <div className={styles['card-caption-container']}>
                <textarea
                  className={`${styles['form-input']} ${styles['textarea']}`}
                  placeholder="Enter a brief description or caption"
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  value={imageData[index].caption}
                ></textarea>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MultiImageInput;
