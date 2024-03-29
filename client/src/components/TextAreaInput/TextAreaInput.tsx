import styles from './TextAreaInput.module.scss';
import { ChangeEvent } from 'react';

interface TextAreaInputProps {
  remainingCharacters?: number;
  value: string | undefined;
  onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void;
  label: string;
  name: string;
  id: string;
  serverError?: string;
  placeholder?: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  remainingCharacters,
  value,
  onChange,
  label,
  name,
  id,
  serverError,
  placeholder,
}) => {
  return (
    <div className={styles['input-container']}>
      <label className={styles['input-label']}>
        {label}
        {remainingCharacters !== undefined && (
          <span
            className={`${styles['remaining-characters']} ${remainingCharacters < 0 ? styles['error'] : ''}`}
          >
            {' '}
            ({remainingCharacters} characters remaining)
          </span>
        )}
      </label>
      <textarea
        rows={3}
        className={`${styles['form-input']} ${styles['textarea']} ${serverError ? styles.error : ''}`}
        onChange={onChange}
        id={id}
        name={name}
        value={value}
        placeholder={placeholder}
      ></textarea>
      {serverError && (
        <div className={styles['input-error-message']}>{serverError}</div>
      )}
    </div>
  );
};

export default TextAreaInput;
