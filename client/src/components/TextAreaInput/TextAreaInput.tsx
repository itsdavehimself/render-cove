import styles from './TextAreaInput.module.scss';
import { ChangeEvent } from 'react';

interface TextAreaInputProps {
  remainingCharacters?: number;
  value: string;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  name: string;
  id: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  remainingCharacters,
  value,
  onChange,
  label,
  name,
  id,
}) => {
  return (
    <div className={styles['input-container']}>
      <label className={styles['input-label']}>
        {label}
        {remainingCharacters && (
          <span
            className={`${styles['remaining-characters']} ${remainingCharacters < 1 ? styles['error'] : ''}`}
          >
            {' '}
            ({remainingCharacters} characters remaining)
          </span>
        )}
      </label>
      <textarea
        rows={3}
        className={`${styles['form-input']} ${styles['textarea']}`}
        onChange={onChange}
        id={id}
        name={name}
        value={value}
      ></textarea>
    </div>
  );
};

export default TextAreaInput;
