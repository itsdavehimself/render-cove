import styles from './EditProjectForm.module.scss';
import { useState, FormEvent, useRef, useEffect, useCallback } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
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
import { customFileValidation } from '../../utility/FileValidation';
import { compressAndSetPreviewMultiple } from '../CreateProjectForm/CreateProjectForm.utility';
import TextAreaInput from '../../components/TextAreaInput/TextAreaInput';
import GenerationDataModal from '../../components/GenerationDataModal/GenerationDataModal';
import ImageData from '../../types/ImageData';
import WorkflowInput from '../../components/WorkflowInput/WorkflowInput';
import PublishSidebar from '../../components/PublishSidebar/PublishSidebar';
import CheckboxInput from '../../components/CheckboxInput/CheckboxInput';
import WorkflowImageInput from '../../components/WorkflowImageInput/WorkflowImageInput';
import EditAlert from '../../components/EditAlert/EditAlert';
import { useParams } from 'react-router-dom';
import DeleteModal from '../../components/DeleteModal/DeleteModal';
import { Image } from '../../types/Project';
import PreviewUploadCards from '../../components/PreviewUploadCards/PreviewUploadCards';
import { useNavigate } from 'react-router-dom';

const CreateProjectForm: React.FC = () => {
  const { user } = useAuthContext();
  const { projectId } = useParams();
  const navigate = useNavigate();

  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [tags, setTags] = useState<string[]>([]);
  const [softwareList, setSoftwareList] = useState<string[]>([]);
  const [isProjectPublished, setIsProjectPublished] = useState<boolean>(false);
  const [previouslyPublished, setPreviouslyPublished] =
    useState<boolean>(false);
  const [CPU, setCPU] = useState<string>('');
  const [GPU, setGPU] = useState<string>('');
  const [RAM, setRAM] = useState<number>(0);
  const [commentAllowedArr, setCommentAllowedArr] = useState<string[]>([
    'commentsAllowed',
  ]);
  const [workflowText, setWorkflowText] = useState<object | null>(null);
  const [existingWorkflowImage, setExistingWorkflowImage] =
    useState<string>('');

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
  const [existingImagesArr, setExistingImagesArr] = useState<
    string[] | undefined
  >([]);
  const [existingImageData, setExistingImageData] = useState<ImageData[]>([]);

  const [workflowImage, setWorkflowImage] = useState<File | null>(null);

  const [isGenerationDataShowing, setIsGenerationDataShowing] =
    useState<boolean>(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState<boolean>(false);
  const [isImageNew, setIsImageNew] = useState<boolean>(false);

  const [error, setError] = useState<Error | null>(null);
  const [isShowingAlert, setIsShowingAlert] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [emptyFields, setEmptyFields] = useState<string[]>([]);

  const MAX_IMAGE_SIZE: number = 5 * 1024 * 1024;
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  const onImageDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const options = {
        maxSizeMB: 0.5,
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
    maxFiles: 6,
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
    formData.append('published', JSON.stringify(isProjectPublished));
    formData.append('imageData', JSON.stringify(imageData));
    formData.append('workflow', JSON.stringify(workflowText));
    formData.append('workflowImage', JSON.stringify(workflowImage));
    formData.append('existingImages', JSON.stringify(existingImagesArr));
    formData.append('existingImageData', JSON.stringify(existingImageData));
    formData.append(
      'existingWorkflowImage',
      JSON.stringify(existingWorkflowImage),
    );

    if (!workflowImage) {
      formData.delete('workflowImage');
    }

    if (compressedImages) {
      compressedImages.forEach((image) => {
        formData.append(`images`, image);
      });
    }

    const editProjectResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}`,
      {
        method: 'PATCH',
        body: formData,
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const projectJson = await editProjectResponse.json();

    if (!editProjectResponse.ok) {
      setError(new Error(projectJson.error));
      setEmptyFields(projectJson.emptyFields);
      setIsLoading(false);
      setIsShowingAlert(true);
    }
    if (editProjectResponse.ok) {
      setIsShowingAlert(true);
      setError(null);
      setIsLoading(false);
      setEmptyFields([]);
    }

    setTimeout(() => {
      setIsShowingAlert(false);
    }, 4000);
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
    }, [inputList, inputRef.current?.value, setInputWidth, inputRef]);
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

  const getIsImageNew = (isImageNew: boolean): void => {
    setIsImageNew(isImageNew);
  };

  useEffect(() => {
    const fetchProjectInfo = async (): Promise<void> => {
      setIsLoading(true);
      const projectResponse = await fetch(
        `${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}`,
        {
          method: 'GET',
        },
      );

      const editProjectJson = await projectResponse.json();

      if (!projectResponse.ok) {
        setError(new Error(editProjectJson.error));
        setIsLoading(false);
      }

      if (projectResponse.ok) {
        setIsLoading(false);
        setTitle(editProjectJson.title);
        setDescription(editProjectJson.description);
        setTags(editProjectJson.tags);
        setSoftwareList(editProjectJson.softwareList);
        setCPU(editProjectJson.hardware.cpu);
        setGPU(editProjectJson.hardware.gpu);
        setRAM(editProjectJson.hardware.ram);
        setIsProjectPublished(editProjectJson.published);
        setPreviouslyPublished(editProjectJson.published);
        setCommentAllowedArr(
          editProjectJson.commentsAllowed ? ['commentsAllowed'] : [],
        );
        const newImageData = editProjectJson.images.map((image: Image) => ({
          url: image.url || '',
          caption: image.caption || '',
          model: image.model || '',
          prompt: image.prompt || '',
          negativePrompt: image.negativePrompt || '',
          cfgScale: image.cfgScale || 0,
          steps: image.steps || 0,
          sampler: image.sampler || '',
          seed: image.seed || 0,
        }));
        setExistingImageData(newImageData);
        const uploadedSrcData = editProjectJson.images.map(
          (image: Image) => image.url,
        );
        setExistingImagesArr(uploadedSrcData);
        setWorkflowText(editProjectJson.workflow);
        setExistingWorkflowImage(
          editProjectJson.workflowImage?.originalFileName,
        );
      }
    };

    fetchProjectInfo();
  }, [projectId]);

  const handleDeleteProjectClick = async (): Promise<void> => {
    const deleteProjectResponse = await fetch(
      `${import.meta.env.VITE_API_BASE_URL}/projects/${projectId}`,
      {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      },
    );

    const deleteJson = await deleteProjectResponse.json();

    if (!deleteProjectResponse.ok) {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      setError(deleteJson.error);
    }

    if (deleteProjectResponse.ok) {
      setIsDeleteModalOpen(false);
      setIsLoading(false);
      navigate('/');
    }
  };

  return (
    <>
      <div className={styles['alert-container']}>
        {isShowingAlert && (
          <EditAlert isSuccess={error === null} itemToUpdate="Project" />
        )}
      </div>
      {isGenerationDataShowing && (
        <GenerationDataModal
          isDataShowing={isGenerationDataShowing}
          setIsDataShowing={setIsGenerationDataShowing}
          singleImageData={imageData[imageIndex]}
          imageData={imageData}
          setImageData={setImageData}
          imageIndex={imageIndex}
          singleExistingImageData={existingImageData[imageIndex]}
          existingImageData={existingImageData}
          setExistingImageData={setExistingImageData}
          isImageNew={isImageNew}
        />
      )}
      {isDeleteModalOpen && (
        <DeleteModal
          isModalOpen={isDeleteModalOpen}
          setIsModalOpen={setIsDeleteModalOpen}
          handleDeleteClick={handleDeleteProjectClick}
          isLoading={isLoading}
          type="project"
        />
      )}
      <div className={styles['create-project-container']}>
        <p className={styles['page-navigation-title']}>Edit project</p>
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
                serverError={
                  emptyFields?.includes('title')
                    ? 'Please enter a title for your project.'
                    : ''
                }
              />
              <TextAreaInput
                remainingCharacters={descriptionCharsRemaining}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                label="Project description"
                name="description"
                id="description"
                serverError={
                  emptyFields?.includes('description')
                    ? 'Please enter a description for your project.'
                    : ''
                }
              />
            </section>
            <MultiImageInput
              getRootProps={getImageRootProps}
              getInputProps={getImageInputProps}
              isDragActive={isImageDragActive}
              fileRejections={imageFileRejections}
              fileSizeLimit="5MB max size (JPEG, JPG, PNG)"
              maxFileCount={6}
              serverError={
                emptyFields?.includes('project images')
                  ? 'Please upload at least one image for your project.'
                  : ''
              }
            />
            <PreviewUploadCards
              existingImageArr={existingImagesArr}
              setExistingImageArr={setExistingImagesArr}
              existingImageData={existingImageData}
              setExistingImageData={setExistingImageData}
              compressedImages={compressedImages}
              setCompressedImages={setCompressedImages}
              imageData={imageData}
              setImageData={setImageData}
              isDataShowing={isGenerationDataShowing}
              setIsDataShowing={setIsGenerationDataShowing}
              getImageIndex={getImageIndex}
              getIsImageNew={getIsImageNew}
            />
            <section className={styles['form-section']}>
              <div className={styles['workflow-header']}>
                <h3 className={styles['section-title']}>Workflow</h3>
                <p className={styles['section-subtitle']}>
                  Give us a look into your workflow, processes, and
                  methodologies of your project
                </p>
              </div>
              <WorkflowInput
                currentContent={workflowText}
                setWorkflowText={setWorkflowText}
                serverError={
                  emptyFields?.includes('workflow')
                    ? 'Please write about or upload a photo of your workflow.'
                    : ''
                }
              />
              <div className={styles['workflow-image-container']}>
                <p className={styles['section-subtitle']}>
                  You can also upload an image of your workflow:
                </p>
                <WorkflowImageInput
                  workflowImage={workflowImage}
                  setWorkflowImage={setWorkflowImage}
                  existingWorkflowImage={existingWorkflowImage}
                  setExistingWorkflowImage={setExistingWorkflowImage}
                />
              </div>
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
                  serverError={
                    emptyFields?.includes('software')
                      ? 'Please include at least one software you used in your project.'
                      : ''
                  }
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
                  serverError={
                    emptyFields?.includes('tags')
                      ? 'Please include at least one tag for your project.'
                      : ''
                  }
                />
              </div>
            </section>
          </div>
          <aside className={styles['form-right-column']}>
            <section className={styles['aside-section']}>
              <h3 className={styles['aside-header']}>Hardware used</h3>
              <FormInput
                htmlFor="cpu"
                label="CPU"
                type="text"
                id="cpu"
                name="cpu"
                value={CPU}
                placeholder="Intel i7-13700K Processor"
                onChange={(e) => setCPU(e.target.value)}
              />
              <FormInput
                htmlFor="gpu"
                label="GPU"
                type="text"
                id="gpu"
                name="gpu"
                value={GPU}
                placeholder="NVIDIA GeForce RTX 4090"
                onChange={(e) => setGPU(e.target.value)}
              />
              <FormInput
                htmlFor="ram"
                label="RAM"
                type="number"
                id="ram"
                name="ram"
                value={RAM === 0 ? '' : RAM}
                placeholder="64"
                onChange={(e) => setRAM(parseInt(e.target.value))}
              />
            </section>
            <section className={styles['aside-section']}>
              <h3 className={styles['aside-header']}>Comments</h3>
              <CheckboxInput
                label="Allow users to comment on this post"
                htmlFor="commentsAllowed"
                name="commentsAllowed"
                id="commentsAllowed"
                isChecked={commentAllowedArr.includes('commentsAllowed')}
                setSectionCheckedBoxes={setCommentAllowedArr}
              />
            </section>
            <PublishSidebar
              isProjectPublished={isProjectPublished}
              setIsProjectPublished={setIsProjectPublished}
              isLoading={isLoading}
              isEditing={true}
              isDeleteModalOpen={isDeleteModalOpen}
              setIsDeleteModalOpen={setIsDeleteModalOpen}
              previouslyPublished={previouslyPublished}
            />
          </aside>
        </form>
      </div>
    </>
  );
};

export default CreateProjectForm;
