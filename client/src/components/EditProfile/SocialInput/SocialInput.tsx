import styles from './SocialInput.module.scss';
import { ChangeEvent, useEffect, useState, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark, faPlus } from '@fortawesome/free-solid-svg-icons';

interface SocialInputProps {
  htmlFor: string;
  icon: React.ReactNode;
  label: string;
  id: string;
  name: string;
  initialValue: string;
  placeholder?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
  serverResponse: boolean;
}

const SocialInput: React.FC<SocialInputProps> = ({
  htmlFor,
  label,
  icon,
  id,
  name,
  initialValue,
  placeholder,
  serverResponse,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [inputValue, setInputValue] = useState<string>(initialValue);
  const [filteredInputValue, setFilteredInputValue] = useState('');

  const xMark: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;
  const plus: React.ReactNode = <FontAwesomeIcon icon={faPlus} />;

  const input = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isAdding) {
      input.current?.focus();
    }

    const filteredValue = inputValue.replace(/[^a-zA-Z0-9_\-.]/g, '');
    const usernameNotValid = filteredValue.length > 30;
    setError(usernameNotValid);
    setFilteredInputValue(filteredValue);
  }, [inputValue, isAdding]);

  useEffect(() => {
    if (serverResponse) {
      setIsAdding(false);
    }
  }, [serverResponse]);

  return (
    <div className={styles['social-input-container']}>
      <label
        className={styles['social-input-label-container']}
        htmlFor={htmlFor}
      >
        <div className={styles['social-icon']}>{icon}</div>
        <div className={styles['social-label']}>{label}</div>
      </label>
      <div className={styles['social-input-controls']}>
        {isAdding ? (
          <>
            <div className={styles['input-container']}>
              <input
                type="text"
                id={id}
                name={name}
                value={filteredInputValue}
                placeholder={placeholder}
                onChange={(e) => setInputValue(e.target.value)}
                className={`${styles['social-link-input']} ${error ? styles['error'] : ''}`}
                ref={input}
              />
              {error && (
                <div className={styles['input-error-message']}>
                  Username must be less than 30 characters.
                </div>
              )}
            </div>
            <button
              className={styles['cancel-social-button']}
              onClick={() => {
                setIsAdding(false);
                setInputValue(initialValue);
              }}
              type="button"
            >
              {xMark}
            </button>
          </>
        ) : (
          <>
            <div className={styles['social-display']}>
              {inputValue !== '' && <>@{inputValue}</>}
            </div>
            <button
              className={styles['add-social-button']}
              onClick={() => setIsAdding(true)}
              type="button"
            >
              {plus}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SocialInput;
