import styles from './TagInput.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface TagInputProps {
  htmlFor: string;
  label: string;
  id: string;
  name: string;
  onClick: () => void;
  isFocusedInput: boolean;
  tagList: string[];
  setTagList: React.Dispatch<React.SetStateAction<string[]>>;
  removeTag: (
    indexToRemove: number,
    setTagList: React.Dispatch<React.SetStateAction<string[]>>,
    tagList: string[],
  ) => void;
  inputRef: React.MutableRefObject<HTMLInputElement | null>;
  size: number;
  setIsFocusedInput: React.Dispatch<React.SetStateAction<boolean>>;
  handleInputChange: () => void;
  handleKeyDown: (
    indexToRemove: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  addTag: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

const TagInput: React.FC<TagInputProps> = ({
  htmlFor,
  label,
  id,
  name,
  onClick,
  isFocusedInput,
  tagList,
  setTagList,
  removeTag,
  inputRef,
  size,
  setIsFocusedInput,
  handleInputChange,
  handleKeyDown,
  addTag,
}) => {
  const xMark: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;

  return (
    <div onClick={onClick} className={styles['input-container']}>
      <label className={styles['edit-profile-label']} htmlFor={htmlFor}>
        {label}
      </label>
      <div
        className={`${styles['edit-profile-input']} ${
          isFocusedInput ? styles['focused'] : ''
        }`}
      >
        <ul className={styles['tag-list']}>
          {tagList.map((tag, index) => (
            <li key={index} className={styles['tag']}>
              <span>{tag}</span>
              <span
                className={styles['delete-tag-icon']}
                onClick={() => removeTag(index, setTagList, tagList)}
              >
                {xMark}
              </span>
            </li>
          ))}
          <input
            className={styles['tag-input']}
            type="text"
            placeholder={
              tagList.length === 0 ? 'Press enter after each item' : ''
            }
            ref={inputRef}
            size={size}
            id={id}
            name={name}
            onFocus={() => setIsFocusedInput(true)}
            onBlur={() => setIsFocusedInput(false)}
            onChange={handleInputChange}
            onKeyDown={(e) => handleKeyDown(tagList.length - 1, e)}
            onKeyUp={(e) =>
              e.key === ',' || e.key === 'Enter' ? addTag(e) : null
            }
          ></input>
        </ul>
      </div>
    </div>
  );
};

export default TagInput;
