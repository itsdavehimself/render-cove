import styles from './SocialInput.module.scss';
import { ChangeEvent } from 'react';
import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

interface SocialInputProps {
  htmlFor: string;
  icon: React.ReactNode;
  label: string;
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  clientError?: string;
  serverError?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const SocialInput: React.FC<SocialInputProps> = ({
  htmlFor,
  label,
  icon,
  id,
  name,
  value,
  placeholder,
  clientError,
  serverError,
  onChange,
}) => {
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const xMark: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;
  const plus: React.ReactNode = <FontAwesomeIcon icon={faPlus} />;

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
            <input
              type="text"
              id={id}
              name={name}
              value={value}
              placeholder={placeholder}
              onChange={onChange}
              className={styles['social-link-input']}
            ></input>
            {clientError && (
              <div className={styles['input-error-message']}>{clientError}</div>
            )}
            {!clientError && serverError && (
              <div className={styles['input-error-message']}>{serverError}</div>
            )}
            <button
              className={styles['cancel-social-button']}
              onClick={() => setIsAdding(false)}
            >
              {xMark}
            </button>
          </>
        ) : (
          <>
            <div>{value}</div>
            <button
              className={styles['add-social-button']}
              onClick={() => setIsAdding(true)}
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
