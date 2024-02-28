import styles from './CreateProjectForm.module.scss';
import { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import FormInput from '../FormInput/FormInput';
import TagInput from '../TagInput/TagInput';
import MultiImageInput from '../MultiImageInput/MultiImageInput';
import {
  addTag,
  removeTag,
  handleInputChange,
  handleInputClick,
  preventEnterKeySubmission,
} from '../TagInput/TagInput.utiility';
import SaveSubmitButton from '../SaveSubmitButton/SaveSubmitButton';
import { useDropzone } from 'react-dropzone';
import { customFileValidation } from '../EditProfile/EditProfileForm/EditProfileForm.utility';
import { compressAndSetPreviewMultiple } from './CreateProjectForm.utility';
import TextAreaInput from '../TextAreaInput/TextAreaInput';

interface ImageData {
  image: string | ArrayBuffer | null;
  compressedImage: File;
  caption: string;
}

const CreateProjectForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [prompt, setPrompt] = useState<string>('');
  const [negativePrompt, setNegativePrompt] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [softwareList, setSoftwareList] = useState<string[]>([]);
  const [models, setModels] = useState<string[]>([]);
  const [lora, setLora] = useState<string[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const tagInputRef = useRef<HTMLInputElement | null>(null);
  const [tagInputWidth, setTagInputWidth] = useState<number>(23);
  const [isTagInputFocused, setIsTagInputFocused] = useState<boolean>(false);

  const softwareInputRef = useRef<HTMLInputElement | null>(null);
  const [softwareInputWidth, setSoftwareInputWidth] = useState<number>(23);
  const [isSoftwareInputFocused, setIsSoftwareInputFocused] =
    useState<boolean>(false);

  const modelsInputRef = useRef<HTMLInputElement | null>(null);
  const [modelsInputWidth, setModelsInputWidth] = useState<number>(23);
  const [isModelsInputFocused, setIsModelsInputFocused] =
    useState<boolean>(false);

  const loraInputRef = useRef<HTMLInputElement | null>(null);
  const [loraInputWidth, setLoraInputWidth] = useState<number>(23);
  const [isLoraInputFocused, setIsLoraInputFocused] = useState<boolean>(false);

  const [descriptionCharsRemaining, setDescriptionCharsRemaining] =
    useState<number>(250);

  const MAX_IMAGE_SIZE: number = 5 * 1024 * 1024;
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  const [imageData, setImageData] = useState<ImageData[]>([]);

  const [compressedImages, setCompressedImages] = useState<File[] | undefined>(
    [],
  );

  const onImageDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const options = {
        maxSizeKB: 512,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      compressAndSetPreviewMultiple(
        acceptedFiles,
        setImageData,
        options,
        setCompressedImages,
      );
    },
    [setImageData],
  );

  const {
    getRootProps: getImageRootProps,
    getInputProps: getImageInputProps,
    isDragActive: isImageDragActive,
    fileRejections: imageFileRejections,
  } = useDropzone({
    onDrop: onImageDrop,
    maxFiles: 5,
    validator: (file) =>
      customFileValidation(file, allowedFileTypes, MAX_IMAGE_SIZE),
  });

  const handleSubmitProject = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();
    setIsLoading(true);
    console.log(imageData);
    const formData = new FormData(e.currentTarget);
    formData.append('tags', JSON.stringify(tags));
    formData.append('softwareList', JSON.stringify(softwareList));
    formData.append('images', JSON.stringify(imageData));

    for (const entry of formData.entries()) {
      console.log(entry);
    }

    // const projectCreateResponse = await fetch(
    //   `${import.meta.env.VITE_API_BASE_URL}/projects`,
    //   {
    //     method: 'POST',
    //     body: formData,
    //   },
    // );

    // const projectJSON = await projectCreateResponse.json();

    // if (!projectCreateResponse.ok) {
    //   setError(new Error(projectJSON.error));
    //   setIsLoading(false);
    // }
    // if (projectCreateResponse.ok) {
    //   setError(null);
    //   setIsLoading(false);
    //   setTitle('');
    //   setDescription('');
    //   setTags([]);
    //   setSoftwareList([]);
    // }
  };

  const handleKeydownTags = (
    indexToRemove: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Backspace' && e.currentTarget.value === '') {
      removeTag(indexToRemove, setTags, tags);
    }
  };

  const handleKeydownSoftware = (
    indexToRemove: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Backspace' && e.currentTarget.value === '') {
      removeTag(indexToRemove, setSoftwareList, softwareList);
    }
  };

  const handleKeydownModels = (
    indexToRemove: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Backspace' && e.currentTarget.value === '') {
      removeTag(indexToRemove, setModels, models);
    }
  };

  const useInputWidthEffect = (
    inputList: string[],
    inputRef: React.MutableRefObject<HTMLInputElement | null>,
    setInputWidth: React.Dispatch<React.SetStateAction<number>>,
  ) => {
    useEffect(() => {
      if (inputList.length === 0 || inputRef.current?.value === '') {
        setInputWidth(23);
      }

      if (inputList.length > 0 && inputRef.current?.value === '') {
        setInputWidth(inputRef.current.value.length || 1);
      }
    }, [inputList, inputRef.current?.value, setInputWidth]);
  };

  useInputWidthEffect(softwareList, softwareInputRef, setSoftwareInputWidth);
  useInputWidthEffect(tags, tagInputRef, setTagInputWidth);
  useInputWidthEffect(models, modelsInputRef, setModelsInputWidth);

  useEffect(() => {
    const MAX_CHARACTERS_BIO = 250;
    const remainingCharacters = MAX_CHARACTERS_BIO - description.length;
    setDescriptionCharsRemaining(remainingCharacters);
  }, [description.length]);

  return (
    <div className={styles['create-project-container']}>
      <p className={styles['page-navigation-title']}>Upload a New Project</p>
      <form
        onSubmit={handleSubmitProject}
        onKeyDown={preventEnterKeySubmission}
        className={styles['create-project-form']}
      >
        <div className={styles['form-left-column']}>
          <section className={styles['form-section']}>
            <h1 className={styles['project-title']}>
              {title ? title : 'Untitled'}
            </h1>
            <FormInput
              htmlFor="title"
              label="Project title"
              type="text"
              id="title"
              name="title"
              value={title}
              placeholder="Give your project a name"
              onChange={(e) => setTitle(e.target.value)}
            />
            <TextAreaInput
              remainingCharacters={descriptionCharsRemaining}
              text={description}
              setText={setDescription}
              label="Project description"
              name="description"
            />
          </section>
          <MultiImageInput
            getRootProps={getImageRootProps}
            getInputProps={getImageInputProps}
            isDragActive={isImageDragActive}
            imageData={imageData}
            setImageData={setImageData}
            fileRejections={imageFileRejections}
            fileSizeLimit="5MB max size (JPEG, JPG, PNG)"
          />
          <section className={styles['prompts-section']}>
            <h3 className={styles['section-title']}>Prompts</h3>
            <div className={styles['prompts-inputs']}>
              <TextAreaInput
                text={prompt}
                setText={setPrompt}
                label="Prompt"
                name="prompt"
              />
              <TextAreaInput
                text={negativePrompt}
                setText={setNegativePrompt}
                label="Negative prompt"
                name="negativePrompt"
              />
            </div>
          </section>
          <section className={styles['form-section']}>
            <div className={styles['input-with-title']}>
              <h3 className={styles['section-title']}>Models & Checkpoints</h3>
              <TagInput
                htmlFor="models"
                label="Add the models or checkpoints used to create these images"
                id="models"
                name=""
                onClick={() => handleInputClick(modelsInputRef)}
                isFocusedInput={isModelsInputFocused}
                tagList={models}
                setTagList={setModels}
                removeTag={removeTag}
                inputRef={modelsInputRef}
                size={modelsInputWidth}
                setIsFocusedInput={setIsModelsInputFocused}
                handleInputChange={() =>
                  handleInputChange(modelsInputRef, setModelsInputWidth)
                }
                handleKeyDown={handleKeydownModels}
                addTag={(e) =>
                  addTag(e, setModels, models, setModelsInputWidth)
                }
                optionalClass={true}
              />
            </div>
            <div className={styles['input-with-title']}>
              <h3 className={styles['section-title']}>LoRA</h3>
              <TagInput
                htmlFor="lora"
                label="If you used any LoRA, list them here"
                id="lora"
                name=""
                onClick={() => handleInputClick(loraInputRef)}
                isFocusedInput={isLoraInputFocused}
                tagList={lora}
                setTagList={setLora}
                removeTag={removeTag}
                inputRef={loraInputRef}
                size={loraInputWidth}
                setIsFocusedInput={setIsLoraInputFocused}
                handleInputChange={() =>
                  handleInputChange(loraInputRef, setLoraInputWidth)
                }
                handleKeyDown={handleKeydownSoftware}
                addTag={(e) => addTag(e, setLora, lora, setLoraInputWidth)}
                optionalClass={true}
              />
            </div>
            <div className={styles['input-with-title']}>
              <h3 className={styles['section-title']}>Software used</h3>
              <TagInput
                htmlFor="software"
                label="Include the software you used to create this project"
                id="software"
                name=""
                onClick={() => handleInputClick(softwareInputRef)}
                isFocusedInput={isSoftwareInputFocused}
                tagList={softwareList}
                setTagList={setSoftwareList}
                removeTag={removeTag}
                inputRef={softwareInputRef}
                size={softwareInputWidth}
                setIsFocusedInput={setIsSoftwareInputFocused}
                handleInputChange={() =>
                  handleInputChange(softwareInputRef, setSoftwareInputWidth)
                }
                handleKeyDown={handleKeydownSoftware}
                addTag={(e) =>
                  addTag(
                    e,
                    setSoftwareList,
                    softwareList,
                    setSoftwareInputWidth,
                  )
                }
                optionalClass={true}
              />
            </div>
            <div className={styles['input-with-title']}>
              <h3 className={styles['section-title']}>Add tags</h3>
              <TagInput
                htmlFor="tags"
                label="Add tags to help others discover your work"
                id="tags"
                name=""
                onClick={() => handleInputClick(tagInputRef)}
                isFocusedInput={isTagInputFocused}
                tagList={tags}
                setTagList={setTags}
                removeTag={removeTag}
                inputRef={tagInputRef}
                size={tagInputWidth}
                setIsFocusedInput={setIsTagInputFocused}
                handleInputChange={() =>
                  handleInputChange(tagInputRef, setTagInputWidth)
                }
                handleKeyDown={handleKeydownTags}
                addTag={(e) => addTag(e, setTags, tags, setTagInputWidth)}
                optionalClass={true}
              />
            </div>
          </section>
          {error && <div>{error.message}</div>}
        </div>
        <div className={styles['form-right-column']}>
          <SaveSubmitButton label="Publish" isLoading={false} />
        </div>
      </form>
    </div>
  );
};

export default CreateProjectForm;
