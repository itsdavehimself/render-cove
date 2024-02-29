import { ChangeEvent } from 'react';
import styles from './FormInput.module.scss';

interface FormInputProps {
  htmlFor: string;
  label: string;
  type: string;
  id: string;
  name: string;
  value: string | number | undefined;
  placeholder?: string;
  clientError?: string;
  serverError?: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
}

const FormInput: React.FC<FormInputProps> = ({
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
      <label className={styles['input-label']} htmlFor={htmlFor}>
        {label}
      </label>
      <input
        className={`${styles['form-input']} ${clientError || serverError ? styles.error : ''}`}
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

export default FormInput;
