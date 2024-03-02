import styles from './GenerationDataModal.module.scss';
import ImageData from '../../types/ImageData';
import { useState, useEffect } from 'react';
import SaveSubmitButton from '../SaveSubmitButton/SaveSubmitButton';
import FormInput from '../FormInput/FormInput';
import TextAreaInput from '../TextAreaInput/TextAreaInput';

interface GenerationDataModalProps {
  isDataShowing: boolean;
  setIsDataShowing: React.Dispatch<React.SetStateAction<boolean>>;
  singleImageData: ImageData;
  imageData: ImageData[];
  setImageData: React.Dispatch<React.SetStateAction<ImageData[]>>;
  imageIndex: number;
}

const GenerationDataModal: React.FC<GenerationDataModalProps> = ({
  isDataShowing,
  setIsDataShowing,
  singleImageData,
  imageData,
  setImageData,
  imageIndex,
}) => {
  const [imageDataObject, setImageDataObject] = useState({
    prompt: singleImageData.prompt,
    negativePrompt: singleImageData.negativePrompt,
    sampler: singleImageData.sampler,
    seed: singleImageData.seed,
    steps: singleImageData.steps,
    model: singleImageData.model,
    cfgScale: singleImageData.cfgScale,
  });

  const handleSaveGenerationData = (): void => {
    const updatedImageData = [...imageData];

    updatedImageData[imageIndex] = {
      ...updatedImageData[imageIndex],
      prompt: imageDataObject.prompt,
      negativePrompt: imageDataObject.negativePrompt,
      sampler: imageDataObject.sampler,
      seed: imageDataObject.seed,
      steps: imageDataObject.steps,
      model: imageDataObject.model,
      cfgScale: imageDataObject.cfgScale,
    };

    setImageData(updatedImageData);
    setIsDataShowing(false);
  };

  useEffect(() => {
    if (isDataShowing) {
      document.body.classList.add(styles['modal-open']);
    } else {
      document.body.classList.remove(styles['modal-open']);
    }

    return () => {
      document.body.classList.remove(styles['modal-open']);
    };
  }, [isDataShowing]);

  return (
    <>
      <div className={styles['modal-overlay']}></div>
      <div className={styles['modal-container']}>
        <div className={styles['generation-data-modal']}>
          <h3 className={styles['generation-title']}>Generation data</h3>
          <div className={styles['prompts-model']}>
            <TextAreaInput
              value={imageDataObject.prompt}
              onChange={(e) =>
                setImageDataObject({
                  ...imageDataObject,
                  prompt: e.target.value,
                })
              }
              label="Prompt"
              name="prompt"
              id="prompt"
            />
            <TextAreaInput
              value={imageDataObject.negativePrompt}
              onChange={(e) =>
                setImageDataObject({
                  ...imageDataObject,
                  negativePrompt: e.target.value,
                })
              }
              label="Negative prompt"
              name="negativePrompt"
              id="negativePrompt"
            />
            <FormInput
              htmlFor="model"
              label="Model"
              type="text"
              id="model"
              name="model"
              value={imageDataObject.model}
              onChange={(e) =>
                setImageDataObject({
                  ...imageDataObject,
                  model: e.target.value,
                })
              }
            />
          </div>
          <div className={styles['generation-data']}>
            <FormInput
              htmlFor="seed"
              label="Seed"
              type="text"
              id="seed"
              name="seed"
              value={imageDataObject.seed === 0 ? '' : imageDataObject.seed}
              onChange={(e) =>
                setImageDataObject({
                  ...imageDataObject,
                  seed: parseInt(e.target.value),
                })
              }
            />
            <FormInput
              htmlFor="sampler"
              label="Sampler"
              type="text"
              id="sampler"
              name="sampler"
              value={imageDataObject.sampler}
              onChange={(e) =>
                setImageDataObject({
                  ...imageDataObject,
                  sampler: e.target.value,
                })
              }
            />
            <FormInput
              htmlFor="steps"
              label="Steps"
              type="text"
              id="steps"
              name="steps"
              value={imageDataObject.steps === 0 ? '' : imageDataObject.steps}
              onChange={(e) =>
                setImageDataObject({
                  ...imageDataObject,
                  steps: parseInt(e.target.value),
                })
              }
            />
            <FormInput
              htmlFor="cfgScale"
              label="CFG Scale"
              type="text"
              id="cfgScale"
              name="cfgScale"
              value={
                imageDataObject.cfgScale === 0 ? '' : imageDataObject.cfgScale
              }
              onChange={(e) =>
                setImageDataObject({
                  ...imageDataObject,
                  cfgScale: parseInt(e.target.value),
                })
              }
            />
          </div>
          <div className={styles['button-container']}>
            <button
              className={styles['close-button']}
              onClick={() => setIsDataShowing(false)}
            >
              Close
            </button>
            <div onClick={handleSaveGenerationData}>
              <SaveSubmitButton label="Save" isLoading={false} color="blue" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default GenerationDataModal;
