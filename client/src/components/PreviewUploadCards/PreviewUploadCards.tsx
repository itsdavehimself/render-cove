import styles from './PreviewUploadCards.module.scss';
import ImageData from '../../types/ImageData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

interface PreviewUploadCardsProps {
  imageData: ImageData[];
  setImageData: React.Dispatch<React.SetStateAction<ImageData[]>>;
  isDataShowing: boolean;
  setIsDataShowing: React.Dispatch<React.SetStateAction<boolean>>;
  getImageIndex: (index: number) => void;
}

const PreviewUploadCards: React.FC<PreviewUploadCardsProps> = ({
  imageData,
  setImageData,
  isDataShowing,
  setIsDataShowing,
  getImageIndex,
}) => {
  const deleteIcon: React.ReactNode = <FontAwesomeIcon icon={faTrash} />;

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

  const handleClickGenerationData = (index: number): void => {
    setIsDataShowing(!isDataShowing);
    getImageIndex(index);
  };

  return (
    <>
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
              </div>
              <div className={styles['card-caption-container']}>
                <textarea
                  className={`${styles['form-input']} ${styles['textarea']}`}
                  placeholder="Enter a brief description or caption"
                  onChange={(e) => handleCaptionChange(index, e.target.value)}
                  value={imageData[index].caption}
                ></textarea>
                <div className={styles['card-buttons']}>
                  <button
                    className={styles['generation-button']}
                    onClick={() => handleClickGenerationData(index)}
                  >
                    Generation Data
                  </button>
                  <button
                    type="button"
                    className={styles['trash-button']}
                    onClick={() => handleDeleteImage(index)}
                  >
                    {deleteIcon}
                  </button>{' '}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PreviewUploadCards;
