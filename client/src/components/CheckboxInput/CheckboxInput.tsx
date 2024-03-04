import styles from './CheckboxInput.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';

interface CheckboxInputProps {
  title?: string;
  description?: string;
  label: string;
  htmlFor: string;
  name: string;
  id: string;
  isChecked: boolean;
  setSectionCheckedBoxes: React.Dispatch<React.SetStateAction<string[]>>;
}

const CheckboxInput: React.FC<CheckboxInputProps> = ({
  title,
  description,
  label,
  htmlFor,
  name,
  id,
  isChecked,
  setSectionCheckedBoxes,
}) => {
  const checkIcon: React.ReactNode = <FontAwesomeIcon icon={faCheck} />;

  const handleCheckboxChange = () => {
    setSectionCheckedBoxes((prevCheckedBoxes) => {
      if (prevCheckedBoxes.includes(id)) {
        return prevCheckedBoxes.filter((checkbox) => checkbox !== id);
      } else {
        return [...prevCheckedBoxes, id];
      }
    });
  };

  return (
    <div className={styles['checkbox-container']}>
      {title && description && (
        <div className={styles['checkbox-container-text']}>
          <h4>{title}</h4>
          <p>{description}</p>
        </div>
      )}
      <div className={styles['input-container']}>
        <input
          type="checkbox"
          name={name}
          id={id}
          checked={isChecked}
          onChange={handleCheckboxChange}
        ></input>
        <span
          onClick={handleCheckboxChange}
          className={`${styles['custom-checkbox']} ${isChecked ? styles['checked'] : ''}`}
        >
          {isChecked && checkIcon}
        </span>
        <label htmlFor={htmlFor}>{label}</label>
      </div>
    </div>
  );
};

export default CheckboxInput;
