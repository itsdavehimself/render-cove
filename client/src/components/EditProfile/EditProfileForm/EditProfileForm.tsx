import styles from './EditProfileForm.module.scss';
import { useAuthContext } from '../../../hooks/useAuthContext';
import useUpdateUser from '../../../hooks/useUserUpdate';
import { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

const EditProfileForm: React.FC = () => {
  const { user } = useAuthContext();
  const { updateUser, error, isLoading } = useUpdateUser();
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

  const xMark: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;

  const addSoftware = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const inputValue: string = e.currentTarget.value.trim();

    if (inputValue !== '') {
      const tagValue: string = e.currentTarget.value.replace(/,/g, '').trim();

      if (tagValue !== '') {
        setSoftwareList([...softwareList, tagValue]);
        e.currentTarget.value = '';
        setSoftwareInputWidth(1);
      }
    }
  };

  const removeSoftware = (indexToRemove: number): void => {
    setSoftwareList(softwareList.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (
    indexToRemove: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Backspace' && e.currentTarget.value === '') {
      removeSoftware(indexToRemove);
    }
  };

  const handleSoftwareInputChange = (): void => {
    if (softwareInputRef.current) {
      setSoftwareInputWidth(softwareInputRef.current.value.length || 1);
    }
  };

  const handleSoftwareClick = (): void => {
    if (softwareInputRef.current) {
      softwareInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (softwareList.length === 0) {
      setSoftwareInputWidth(23);
    }
  }, [softwareList]);

  const addGenerator = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    const inputValue: string = e.currentTarget.value.trim();

    if (inputValue !== '') {
      const tagValue: string = e.currentTarget.value.replace(/,/g, '').trim();

      if (tagValue !== '') {
        setGeneratorsList([...generatorsList, tagValue]);
        e.currentTarget.value = '';
        setGeneratorsInputWidth(1);
      }
    }
  };

  const removeGenerators = (indexToRemove: number): void => {
    setGeneratorsList(
      generatorsList.filter((_, index) => index !== indexToRemove),
    );
  };

  const handleKeyDownGenerators = (
    indexToRemove: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ): void => {
    if (e.key === 'Backspace' && e.currentTarget.value === '') {
      removeGenerators(indexToRemove);
    }
  };

  const handleGeneratorsInputChange = (): void => {
    if (generatorsInputRef.current) {
      setGeneratorsInputWidth(generatorsInputRef.current.value.length || 1);
    }
  };

  const handleGeneratorsClick = (): void => {
    if (generatorsInputRef.current) {
      generatorsInputRef.current.focus();
    }
  };

  useEffect(() => {
    if (generatorsList.length === 0) {
      setGeneratorsInputWidth(23);
    }
  }, [generatorsList]);

  const preventEnterKeySubmission = (
    e: React.KeyboardEvent<HTMLFormElement>,
  ): void => {
    const target = e.target as HTMLInputElement | HTMLTextAreaElement;
    if (e.key === 'Enter' && !['TEXTAREA', 'BUTTON'].includes(target.tagName)) {
      e.preventDefault();
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
        onSubmit={() => console.log('submit')}
        noValidate
        onKeyDown={preventEnterKeySubmission}
      >
        <div className={styles['edit-image-container']}>
          <label className={styles['edit-profile-label']} htmlFor="">
            Avatar
          </label>
          <label className={styles['edit-profile-label']} htmlFor="">
            Banner
          </label>
          <div className={styles['edit-avatar-box']}>
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
          <div className={styles['edit-banner-box']}>
            <img
              className={styles['banner-image-preview']}
              src={user.avatarUrl}
            ></img>
            <div className={styles['avatar-upload-description']}>
              <p className={styles['avatar-upload-main']}>
                Drag image here or click to upload
              </p>
              <p className={styles['avatar-size-limit']}>1MB max size</p>
            </div>
          </div>
        </div>
        <div className={styles['edit-profile-info-form']}>
          <div className={styles['input-container']}>
            <label className={styles['edit-profile-label']}>Bio</label>
            <textarea
              rows={3}
              className={`${styles['edit-profile-input']} ${styles['textarea']}`}
            ></textarea>
          </div>
          <div className={styles['input-container']}>
            <label className={styles['edit-profile-label']}>Tagline</label>
            <input type="text" className={styles['edit-profile-input']}></input>
          </div>
          <div className={styles['input-container']}>
            <label className={styles['edit-profile-label']}>Location</label>
            <input type="text" className={styles['edit-profile-input']}></input>
          </div>
          <div
            onClick={handleSoftwareClick}
            className={styles['input-container']}
          >
            <label className={styles['edit-profile-label']} htmlFor="software">
              Tools and Software
            </label>
            <div
              className={`${styles['edit-profile-input']} ${
                isSoftwareInputFocused ? styles['focused'] : ''
              }`}
            >
              <ul className={styles['tag-list']}>
                {softwareList.map((software, index) => (
                  <li key={index} className={styles['tag']}>
                    <span>{software}</span>
                    <span
                      className={styles['delete-tag-icon']}
                      onClick={() => removeSoftware(index)}
                    >
                      {xMark}
                    </span>
                  </li>
                ))}
                <input
                  className={styles['tag-input']}
                  type="text"
                  placeholder={
                    softwareList.length === 0
                      ? 'Press enter after each item'
                      : ''
                  }
                  ref={softwareInputRef}
                  size={softwareInputWidth}
                  id="software"
                  name="software"
                  onFocus={() => setIsSoftwareInputFocused(true)}
                  onBlur={() => setIsSoftwareInputFocused(false)}
                  onChange={handleSoftwareInputChange}
                  onKeyDown={(e) => handleKeyDown(softwareList.length - 1, e)}
                  onKeyUp={(e) =>
                    e.key === ',' || e.key === 'Enter' ? addSoftware(e) : null
                  }
                ></input>
              </ul>
            </div>
          </div>
          <div
            onClick={handleGeneratorsClick}
            className={styles['input-container']}
          >
            <label className={styles['edit-profile-label']} htmlFor="software">
              Image Generators
            </label>
            <div
              className={`${styles['edit-profile-input']} ${
                isGeneratorsInputFocused ? styles['focused'] : ''
              }`}
            >
              <ul className={styles['tag-list']}>
                {generatorsList.map((generator, index) => (
                  <li key={index} className={styles['tag']}>
                    <span>{generator}</span>
                    <span
                      className={styles['delete-tag-icon']}
                      onClick={() => removeGenerators(index)}
                    >
                      {xMark}
                    </span>
                  </li>
                ))}
                <input
                  className={styles['tag-input']}
                  type="text"
                  placeholder={
                    generatorsList.length === 0
                      ? 'Press enter after each item'
                      : ''
                  }
                  ref={generatorsInputRef}
                  size={generatorsInputWidth}
                  id="software"
                  name="software"
                  onFocus={() => setIsGeneratorsInputFocused(true)}
                  onBlur={() => setIsGeneratorsInputFocused(false)}
                  onChange={handleGeneratorsInputChange}
                  onKeyDown={(e) =>
                    handleKeyDownGenerators(generatorsList.length - 1, e)
                  }
                  onKeyUp={(e) =>
                    e.key === ',' || e.key === 'Enter' ? addGenerator(e) : null
                  }
                ></input>
              </ul>
            </div>
          </div>
        </div>
        <button className={styles['save-edit-button']} disabled={isLoading}>
          Save
        </button>
      </form>
    </div>
  );
};

export default EditProfileForm;
