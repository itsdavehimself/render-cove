import styles from './EditProfileForm.module.scss';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useUpdateUser from '../../../hooks/useUserUpdate';
import { useState, useRef, useEffect } from 'react';
import EditProfileInput from '../EditProfileInput/EditProfileInput';
import TagInput from '../../TagInput/TagInput';
import {
  addTag,
  removeTag,
  handleInputChange,
  handleInputClick,
  preventEnterKeySubmission,
} from './EditProfileForm.utility';

const EditProfileForm: React.FC = () => {
  const { user } = useAuthContext();
  const { updateUser, error, isLoading } = useUpdateUser();
  const avatarInputRef = useRef<HTMLInputElement | null>(null);
  const bannerInputRef = useRef<HTMLInputElement | null>(null);

  const [softwareList, setSoftwareList] = useState<string[]>([]);
  const [softwareInputWidth, setSoftwareInputWidth] = useState(23);
  const softwareInputRef = useRef<HTMLInputElement | null>(null);
  const [isSoftwareInputFocused, setIsSoftwareInputFocused] =
    useState<boolean>(false);

  const [generatorsList, setGeneratorsList] = useState<string[]>([]);
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
        onSubmit={() => console.log('submit')}
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
          <div
            className={styles['edit-avatar-box']}
            onClick={() => avatarInputRef.current?.click()}
          >
            <input
              className={styles['profile-image-input']}
              type="file"
              id="avatarInput"
              name="avatarInput"
              ref={avatarInputRef}
            ></input>
            <div className={styles['avatar-circle']}>
              <img src={user.avatarUrl}></img>
            </div>
            <div className={styles['avatar-upload-description']}>
              <p className={styles['avatar-upload-main']}>
                Drag image here or click to upload
              </p>
              <p className={styles['avatar-size-limit']}>1MB max size</p>
            </div>
          </div>
          <div
            className={styles['edit-banner-box']}
            onClick={() => bannerInputRef.current?.click()}
          >
            <input
              className={styles['profile-image-input']}
              type="file"
              id="bannerInput"
              name="bannerInput"
              ref={bannerInputRef}
            ></input>
            <div className={styles['banner-image-container']}>
              <img
                className={styles['banner-image-preview']}
                src={user.avatarUrl}
              ></img>
            </div>
            <div className={styles['avatar-upload-description']}>
              <p className={styles['avatar-upload-main']}>
                Drag image here or click to upload
              </p>
              <p className={styles['avatar-size-limit']}>1MB max size</p>
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
            name="software"
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
            name="generators"
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
      </form>
    </div>
  );
};

export default EditProfileForm;
