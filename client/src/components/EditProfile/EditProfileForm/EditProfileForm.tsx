import styles from './EditProfileForm.module.scss';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useUpdateUser from '../../../hooks/useUserUpdate';
import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import FormInput from '../../FormInput/FormInput';
import TagInput from '../../TagInput/TagInput';
import {
  customFileValidation,
  compressAndSetPreview,
} from './EditProfileForm.utility';
import {
  addTag,
  removeTag,
  handleInputChange,
  handleInputClick,
  preventEnterKeySubmission,
} from '../../TagInput/TagInput.utiility';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import { AlertInfo } from '../../../containers/EditProfile/EditProfile';
import { handleAlert } from '../EditProfile.utility';
import SingleImageInput from '../../SingleImageInput/SingleImageInput';

interface EditProfileFormProps {
  alertInfo: AlertInfo;
  setAlertInfo: React.Dispatch<React.SetStateAction<AlertInfo>>;
}

const EditProfileForm: React.FC<EditProfileFormProps> = ({
  alertInfo,
  setAlertInfo,
}) => {
  const { user } = useAuthContext();
  const { updateUser, error, isLoading } = useUpdateUser();

  const [softwareList, setSoftwareList] = useState<string[]>(user.software);
  const [softwareInputWidth, setSoftwareInputWidth] = useState(23);
  const softwareInputRef = useRef<HTMLInputElement | null>(null);
  const [isSoftwareInputFocused, setIsSoftwareInputFocused] =
    useState<boolean>(false);

  const [generatorsList, setGeneratorsList] = useState<string[]>(
    user.generators,
  );
  const [generatorsInputWidth, setGeneratorsInputWidth] = useState(23);
  const generatorsInputRef = useRef<HTMLInputElement | null>(null);
  const [isGeneratorsInputFocused, setIsGeneratorsInputFocused] =
    useState<boolean>(false);

  const [website, setWebsite] = useState<string>(user.website);
  const [websiteError, setWebsiteError] = useState<boolean>(false);
  const [bio, setBio] = useState<string>(user.summary);
  const [bioCharsRemaining, setBioCharsRemaining] = useState<number>(500);
  const [tagline, setTagline] = useState<string>(user.tagline);
  const [taglineError, setTaglineError] = useState<boolean>(false);
  const [location, setLocation] = useState<string>(user.location);
  const [locationError, setLocationError] = useState<boolean>(false);

  const [avatarPreview, setAvatarPreview] = useState<
    string | ArrayBuffer | null
  >(user.avatarUrl);
  const [bannerPreview, setBannerPreview] = useState<
    string | ArrayBuffer | null
  >(user.bannerUrl);

  const [compressedAvatarImage, setCompressedAvatarImage] =
    useState<File | null>(null);
  const [compressedBannerImage, setCompressedBannerImage] =
    useState<File | null>(null);

  const MAX_IMAGE_SIZE: number = 5 * 1024 * 1024;
  const allowedFileTypes = ['image/jpeg', 'image/jpg', 'image/png'];

  const handleKeyDownSoftware = (
    indexToRemove: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Backspace' && e.currentTarget.value === '') {
      removeTag(indexToRemove, setSoftwareList, softwareList);
    }
  };

  const handleKeyDownGenerators = (
    indexToRemove: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Backspace' && e.currentTarget.value === '') {
      removeTag(indexToRemove, setGeneratorsList, generatorsList);
    }
  };

  useEffect(() => {
    const isTaglineValid = tagline.length <= 75;
    const isLocationValid = location.length <= 30;
    setTaglineError(!isTaglineValid);
    setLocationError(!isLocationValid);

    const MAX_CHARACTERS_BIO = 500;
    const remainingCharacters = MAX_CHARACTERS_BIO - bio.length;
    setBioCharsRemaining(remainingCharacters);

    const isValidWebsite = (website: string) => {
      const urlRegex = /^[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
      return urlRegex.test(website);
    };

    setWebsiteError(!isValidWebsite(website) && website.length > 0);
  }, [tagline, location, bio, website]);

  useEffect(() => {
    if (softwareList.length === 0 || softwareInputRef.current?.value === '') {
      setSoftwareInputWidth(23);
    }

    if (softwareList.length > 0 && softwareInputRef.current?.value === '') {
      setSoftwareInputWidth(softwareInputRef.current.value.length || 1);
    }

    if (
      generatorsList.length === 0 ||
      generatorsInputRef.current?.value === ''
    ) {
      setGeneratorsInputWidth(23);
    }

    if (generatorsList.length > 0 && generatorsInputRef.current?.value === '') {
      setGeneratorsInputWidth(generatorsInputRef.current.value.length || 1);
    }
  }, [
    softwareList,
    softwareInputRef.current?.value,
    generatorsList,
    generatorsInputRef.current?.value,
  ]);

  const onAvatarDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const options = {
        maxSizeKB: 100,
        maxWidthOrHeight: 200,
        useWebWorker: true,
      };

      compressAndSetPreview(
        acceptedFiles,
        setAvatarPreview,
        options,
        setCompressedAvatarImage,
      );
    },
    [setAvatarPreview],
  );

  const onBannerDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const options = {
        maxSizeKB: 1024,
        maxWidthOrHeight: 0,
        useWebWorker: true,
      };

      compressAndSetPreview(
        acceptedFiles,
        setBannerPreview,
        options,
        setCompressedBannerImage,
      );
    },
    [setBannerPreview],
  );

  const {
    getRootProps: getAvatarRootProps,
    getInputProps: getAvatarInputProps,
    isDragActive: isAvatarDragActive,
    fileRejections: avatarFileRejections,
  } = useDropzone({
    onDrop: onAvatarDrop,
    maxFiles: 1,
    validator: (file) =>
      customFileValidation(file, allowedFileTypes, MAX_IMAGE_SIZE),
  });

  const {
    getRootProps: getBannerRootProps,
    getInputProps: getBannerInputProps,
    isDragActive: isBannerDragActive,
    fileRejections: bannerFileRejections,
  } = useDropzone({
    onDrop: onBannerDrop,
    maxFiles: 1,
    validator: (file) =>
      customFileValidation(file, allowedFileTypes, MAX_IMAGE_SIZE),
  });

  const handleSubmitEdit = async (
    e: FormEvent<HTMLFormElement>,
  ): Promise<void> => {
    e.preventDefault();

    const formData = new FormData(e.currentTarget);
    if (compressedAvatarImage) {
      formData.append('avatarFile', compressedAvatarImage);
    }
    if (compressedBannerImage) {
      formData.append('bannerFile', compressedBannerImage);
    }
    formData.append('software', JSON.stringify(softwareList));
    formData.append('generators', JSON.stringify(generatorsList));

    try {
      await updateUser(formData);
      handleAlert(true, alertInfo, setAlertInfo);
    } catch (error) {
      handleAlert(false, alertInfo, setAlertInfo);
    }
  };

  return (
    <div className={styles['edit-profile-form']}>
      <header className={styles['profile-section-header']}>
        <h2 className={styles['edit-profile-header']}>Profile</h2>
        <p className={styles['edit-profile-description']}>
          Add some info to let people know what you're about
        </p>
      </header>
      <form
        className={styles['profile-form']}
        onSubmit={handleSubmitEdit}
        noValidate
        onKeyDown={preventEnterKeySubmission}
      >
        <div className={styles['edit-image-container']}>
          <label className={styles['edit-profile-label']} htmlFor="avatarInput">
            Avatar
          </label>
          <label className={styles['edit-profile-label']} htmlFor="bannerInput">
            Banner
          </label>
          <SingleImageInput
            getRootProps={getAvatarRootProps}
            getInputProps={getAvatarInputProps}
            isDragActive={isAvatarDragActive}
            imagePreview={avatarPreview}
            fileRejections={avatarFileRejections}
            fileSizeLimit="5MB max size (JPEG, JPG, PNG)"
            imagePreviewClassName="avatar-circle"
            imageContainerClassName="avatar-preview"
          />
          <SingleImageInput
            getRootProps={getBannerRootProps}
            getInputProps={getBannerInputProps}
            isDragActive={isBannerDragActive}
            imagePreview={bannerPreview}
            fileRejections={bannerFileRejections}
            fileSizeLimit="5MB max size (1920px x 512px)"
            imagePreviewClassName="banner-image-preview"
            imageContainerClassName="banner-image-container"
          />
        </div>
        <div className={styles['edit-profile-info-form']}>
          <FormInput
            htmlFor="website"
            label="Website"
            type="text"
            id="website"
            name="website"
            value={website}
            placeholder="yourwebsite.com"
            clientError={websiteError ? 'Please enter a valid website' : ''}
            onChange={(e) => setWebsite(e.target.value)}
          />
          <div className={styles['input-container']}>
            <label className={styles['edit-profile-label']}>
              Bio{' '}
              <span
                className={`${styles['bio-remaining-characters']} ${bioCharsRemaining < 1 ? styles['error'] : ''}`}
              >
                ({bioCharsRemaining} characters remaining)
              </span>
            </label>
            <textarea
              rows={3}
              className={`${styles['edit-profile-input']} ${styles['textarea']}`}
              onChange={(e) => setBio(e.target.value)}
              name="summary"
              value={bio}
            ></textarea>
          </div>
          <FormInput
            htmlFor="tagline"
            label="Tagline"
            type="text"
            id="tagline"
            name="tagline"
            value={tagline}
            clientError={
              taglineError ? 'Your tagline cannot exceed 30 characters.' : ''
            }
            onChange={(e) => setTagline(e.target.value)}
          />
          <FormInput
            htmlFor="location"
            label="Location"
            type="text"
            id="location"
            name="location"
            value={location}
            clientError={
              locationError ? 'Location cannot exceed 30 characters.' : ''
            }
            onChange={(e) => setLocation(e.target.value)}
          />
          <TagInput
            htmlFor="software"
            label="Tools and Software"
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
            handleKeyDown={handleKeyDownSoftware}
            addTag={(e) =>
              addTag(e, setSoftwareList, softwareList, setSoftwareInputWidth)
            }
          />
          <TagInput
            htmlFor="generators"
            label="AI Generators & UI"
            id="generators"
            name=""
            onClick={() => handleInputClick(generatorsInputRef)}
            isFocusedInput={isGeneratorsInputFocused}
            tagList={generatorsList}
            setTagList={setGeneratorsList}
            removeTag={removeTag}
            inputRef={generatorsInputRef}
            size={generatorsInputWidth}
            setIsFocusedInput={setIsGeneratorsInputFocused}
            handleInputChange={() =>
              handleInputChange(generatorsInputRef, setGeneratorsInputWidth)
            }
            handleKeyDown={handleKeyDownGenerators}
            addTag={(e) =>
              addTag(
                e,
                setGeneratorsList,
                generatorsList,
                setGeneratorsInputWidth,
              )
            }
          />
        </div>
        <div className={styles['save-button-container']}>
          <SaveSubmitButton label="Save" isLoading={isLoading} />
        </div>
        {error && <div>{error.toString()}</div>}
      </form>
    </div>
  );
};

export default EditProfileForm;
