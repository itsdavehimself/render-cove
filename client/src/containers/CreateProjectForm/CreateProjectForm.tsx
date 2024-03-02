import styles from './CreateProjectForm.module.scss';
import { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import FormInput from '../../components/FormInput/FormInput';
import TagInput from '../../components/TagInput/TagInput';
import MultiImageInput from '../../components/MultiImageInput/MultiImageInput';
import {
  addTag,
  removeTag,
  handleInputChange,
  handleInputClick,
  preventEnterKeySubmission,
} from '../../components/TagInput/TagInput.utiility';
import { useDropzone } from 'react-dropzone';
import { customFileValidation } from '../../components/EditProfile/EditProfileForm/EditProfileForm.utility';
import { compressAndSetPreviewMultiple } from './CreateProjectForm.utility';
import TextAreaInput from '../../components/TextAreaInput/TextAreaInput';
import GenerationDataModal from '../../components/GenerationDataModal/GenerationDataModal';
import PreviewUploadCards from '../../components/PreviewUploadCards/PreviewUploadCards';
import ImageData from '../../types/ImageData';
import WorkflowInput from '../../components/WorkflowInput/WorkflowInput';
import PublishSidebar from '../../components/PublishSidebar/PublishSidebar';

const CreateProjectForm: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [softwareList, setSoftwareList] = useState<string[]>([]);
  const [isProjectPublished, setIsProjectPublished] = useState<boolean>(false);

  const tagInputRef = useRef<HTMLInputElement | null>(null);
  const [tagInputWidth, setTagInputWidth] = useState<number>(23);
  const [isTagInputFocused, setIsTagInputFocused] = useState<boolean>(false);

  const softwareInputRef = useRef<HTMLInputElement | null>(null);
  const [softwareInputWidth, setSoftwareInputWidth] = useState<number>(23);
  const [isSoftwareInputFocused, setIsSoftwareInputFocused] =
    useState<boolean>(false);

  const [descriptionCharsRemaining, setDescriptionCharsRemaining] =
    useState<number>(250);

  const [imageIndex, setImageIndex] = useState<number>(0);
  const [imageData, setImageData] = useState<ImageData[]>([]);
  const [compressedImages, setCompressedImages] = useState<File[] | undefined>(
    [],
  );

  const [isGenerationDataShowing, setIsGenerationDataShowing] =
    useState<boolean>(false);

  const [error, setError] = useState<Error | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const MAX_IMAGE_SIZE: number = 5 * 1024 * 1024;
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

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
    const formData = new FormData(e.currentTarget);
    formData.append('tags', JSON.stringify(tags));
    formData.append('softwareList', JSON.stringify(softwareList));
    formData.append('images', JSON.stringify(imageData));

    // for (const entry of formData.entries()) {
    //   console.log(entry);
    // }

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

  useEffect(() => {
    const MAX_CHARACTERS_BIO = 250;
    const remainingCharacters = MAX_CHARACTERS_BIO - description.length;
    setDescriptionCharsRemaining(remainingCharacters);
  }, [description.length]);

  const getImageIndex = (index: number): void => {
    setImageIndex(index);
  };

  return (
    <>
      {isGenerationDataShowing && (
        <GenerationDataModal
          isDataShowing={isGenerationDataShowing}
          setIsDataShowing={setIsGenerationDataShowing}
          singleImageData={imageData[imageIndex]}
          imageData={imageData}
          setImageData={setImageData}
          imageIndex={imageIndex}
        />
      )}
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
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="Project description"
                name="description"
                id="description"
              />
            </section>
            <MultiImageInput
              getRootProps={getImageRootProps}
              getInputProps={getImageInputProps}
              isDragActive={isImageDragActive}
              fileRejections={imageFileRejections}
              fileSizeLimit="5MB max size (JPEG, JPG, PNG)"
            />
            <PreviewUploadCards
              imageData={imageData}
              setImageData={setImageData}
              isDataShowing={isGenerationDataShowing}
              setIsDataShowing={setIsGenerationDataShowing}
              getImageIndex={getImageIndex}
            />
            <section className={styles['form-section']}>
              <div className={styles['workflow-header']}>
                <h3 className={styles['section-title']}>Workflow</h3>
                <p className={styles['section-subtitle']}>
                  Give us a look into your workflow, processes, and
                  methodologies of your project
                </p>
              </div>
              <WorkflowInput />
            </section>
            <section className={styles['form-section']}>
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
          <aside className={styles['form-right-column']}>
            <PublishSidebar
              isProjectPublished={isProjectPublished}
              setIsProjectPublished={setIsProjectPublished}
            />
          </aside>
        </form>
      </div>
    </>
  );
};

export default CreateProjectForm;
