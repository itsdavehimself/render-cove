import styles from './EditProfileForm.module.scss';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useUpdateUser from '../../../hooks/useUserUpdate';
import { useState, useRef, useEffect, useCallback, FormEvent } from 'react';
import { useDropzone } from 'react-dropzone';
import EditProfileInput from '../EditProfileInput/EditProfileInput';
import TagInput from '../../TagInput/TagInput';
import {
  addTag,
  removeTag,
  handleInputChange,
  handleInputClick,
  preventEnterKeySubmission,
  customFileValidation,
  compressAndSetPreview,
} from './EditProfileForm.utility';

const EditProfileForm: React.FC = () => {
  const { user } = useAuthContext();
  const { updateUser, error, isLoading } = useUpdateUser();

  const [softwareList, setSoftwareList] = useState<string[]>(
    user.software ? JSON.parse(user.software) : [],
  );
  const [softwareInputWidth, setSoftwareInputWidth] = useState(23);
  const softwareInputRef = useRef<HTMLInputElement | null>(null);
  const [isSoftwareInputFocused, setIsSoftwareInputFocused] =
    useState<boolean>(false);

  const [generatorsList, setGeneratorsList] = useState<string[]>(
    user.generators ? JSON.parse(user.generators) : [],
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
  >(null);

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
    const isTaglineValid = tagline.length <= 30;
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

      compressAndSetPreview(acceptedFiles, setAvatarPreview, options);
    },
    [setAvatarPreview],
  );

  const onBannerDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const options = {
        maxSizeKB: 1024,
        maxWidthOrHeight: 1920,
        useWebWorker: true,
      };

      compressAndSetPreview(acceptedFiles, setBannerPreview, options);
    },
    [setBannerPreview],
  );

  const {
    getRootProps: getAvatarRootProps,
    getInputProps: getAvatarInputProps,
    isDragActive: isAvatarDragActive,
    acceptedFiles: acceptedAvatarFile,
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
    acceptedFiles: acceptedBannerFile,
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
    formData.append('avatarFile', acceptedAvatarFile[0]);
    formData.append('bannerFile', acceptedBannerFile[0]);
    formData.append('software', JSON.stringify(softwareList));
    formData.append('generators', JSON.stringify(generatorsList));

    await updateUser(formData);
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
          <div {...getAvatarRootProps()}>
            <input {...getAvatarInputProps()} />
            <div
              className={`${styles['edit-avatar-box']} ${isAvatarDragActive ? styles['dragging'] : ''}`}
            >
              <div className={styles['avatar-circle']}>
                <img
                  className={styles['avatar-preview']}
                  src={
                    typeof avatarPreview === 'string'
                      ? avatarPreview
                      : avatarPreview instanceof ArrayBuffer
                        ? 'data:image/jpeg;base64,' +
                          Buffer.from(avatarPreview).toString('base64')
                        : ''
                  }
                ></img>
              </div>
              <div className={styles['avatar-upload-description']}>
                <div className={styles['avatar-upload-main']}>
                  {isAvatarDragActive ? (
                    <p>Drop it like it's hot 🔥</p>
                  ) : (
                    <p className={styles['avatar-upload-main']}>
                      Drag image here or click to upload
                    </p>
                  )}
                </div>
                <p className={styles['avatar-size-limit']}>
                  5MB max size (JPEG, JPG, PNG)
                </p>
                {avatarFileRejections.length > 0 && (
                  <div className={styles['file-input-error']}>
                    {avatarFileRejections.map(({ errors }) =>
                      errors.map((e) => <>{e.message}</>),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
          <div {...getBannerRootProps()}>
            <input {...getBannerInputProps()} />
            <div
              className={`${styles['edit-banner-box']} ${isBannerDragActive ? styles['dragging'] : ''}`}
            >
              <div className={styles['banner-image-container']}>
                <img
                  className={styles['banner-image-preview']}
                  src={
                    typeof bannerPreview === 'string'
                      ? bannerPreview
                      : bannerPreview instanceof ArrayBuffer
                        ? 'data:image/jpeg;base64,' +
                          Buffer.from(bannerPreview).toString('base64')
                        : ''
                  }
                ></img>
              </div>
              <div className={styles['avatar-upload-description']}>
                <div className={styles['avatar-upload-main']}>
                  {isBannerDragActive ? (
                    <p>Drop it like it's hot 🔥</p>
                  ) : (
                    <p className={styles['avatar-upload-main']}>
                      Drag image here or click to upload
                    </p>
                  )}
                </div>
                <p className={styles['avatar-size-limit']}>
                  5MB max size (1920px x 640px)
                </p>
                {bannerFileRejections.length > 0 && (
                  <div className={styles['file-input-error']}>
                    {bannerFileRejections.map(({ errors }) =>
                      errors.map((e) => <>{e.message}</>),
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className={styles['edit-profile-info-form']}>
          <EditProfileInput
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
          <EditProfileInput
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
          <EditProfileInput
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
            label="AI Generators"
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
        <button className={styles['save-edit-button']} disabled={isLoading}>
          Save
        </button>
        {error && <div>{error.toString()}</div>}
      </form>
    </div>
  );
};

export default EditProfileForm;
