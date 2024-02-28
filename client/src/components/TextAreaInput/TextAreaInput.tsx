import styles from './TextAreaInput.module.scss';

interface TextAreaInputProps {
  remainingCharacters?: number;
  text: string;
  setText: React.Dispatch<React.SetStateAction<string>>;
  label: string;
  name: string;
}

const TextAreaInput: React.FC<TextAreaInputProps> = ({
  remainingCharacters,
  text,
  setText,
  label,
  name,
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
        onChange={(e) => setText(e.target.value)}
        name={name}
        value={text}
      ></textarea>
    </div>
  );
};

export default TextAreaInput;
