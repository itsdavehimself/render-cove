import styles from './PreviewUploadCards.module.scss';
import ImageData from '../../types/ImageData';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { useState, useEffect } from 'react';

interface PreviewUploadCardsProps {
  compressedImages: File[] | undefined;
  setCompressedImages: React.Dispatch<React.SetStateAction<File[] | undefined>>;
  imageData: ImageData[];
  setImageData: React.Dispatch<React.SetStateAction<ImageData[]>>;
  isDataShowing: boolean;
  setIsDataShowing: React.Dispatch<React.SetStateAction<boolean>>;
  getImageIndex: (index: number) => void;
}

const PreviewUploadCards: React.FC<PreviewUploadCardsProps> = ({
  compressedImages,
  setCompressedImages,
  imageData,
  setImageData,
  isDataShowing,
  setIsDataShowing,
  getImageIndex,
}) => {
  const [imageSrcArray, setImageSrcArray] = useState<string[]>([]);
  const deleteIcon: React.ReactNode = <FontAwesomeIcon icon={faTrash} />;

  const handleDeleteImage = (indexToRemove: number): void => {
    setImageData((prevImageData) =>
      prevImageData.filter((_, index) => index !== indexToRemove),
    );

    setCompressedImages(
      (prevCompressedImages) =>
        prevCompressedImages &&
        prevCompressedImages.filter((_, index) => index !== indexToRemove),
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

  useEffect(() => {
    if (compressedImages) {
      const loadImages = async () => {
        const promises = compressedImages.map((image) => {
          return new Promise<string>((resolve) => {
            const fileReader = new FileReader();
            fileReader.onload = (e) => {
              resolve(e.target?.result as string);
            };
            fileReader.readAsDataURL(image);
          });
        });

        const dataURLs = await Promise.all(promises);
        setImageSrcArray((prevImageSrcArray) => [
          ...prevImageSrcArray,
          ...dataURLs,
        ]);
      };

      loadImages();
    }
  }, [compressedImages]);

  return (
    <>
      {imageData.length > 0 && (
        <div className={styles['preview-cards-container']}>
          {imageData.map((_, index) => (
            <div className={styles['preview-card']} key={index}>
              <div className={styles['image-container']}>
                <img
                  className={`${styles['image-preview']}`}
                  src={imageSrcArray[index]}
                  alt={`Preview ${index}`}
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
