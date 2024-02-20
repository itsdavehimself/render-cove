import { ChangeEvent } from 'react';
import styles from './EditProfileInput.module.scss';

interface EditProfileInputProps {
  htmlFor: string;
  label: string;
  type: string;
  id: string;
  name: string;
  value: string;
  placeholder?: string;
  clientError?: string;
  serverError?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const EditProfileInput: React.FC<EditProfileInputProps> = ({
  htmlFor,
  label,
  type,
  id,
  name,
  value,
  placeholder,
  clientError,
  serverError,
  onChange,
}) => {
  return (
    <div className={styles['input-container']}>
      <label className={styles['edit-profile-label']} htmlFor={htmlFor}>
        {label}
      </label>
      <input
        className={`${styles['edit-profile-input']} ${clientError || serverError ? styles.error : ''}`}
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
      {clientError && (
        <div className={styles['input-error-message']}>{clientError}</div>
      )}
      {!clientError && serverError && (
        <div className={styles['input-error-message']}>{serverError}</div>
      )}
    </div>
  );
};

export default EditProfileInput;
