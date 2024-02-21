import styles from './EditProfileCheckBox.module.scss';

interface EditProfileCheckBoxProps {
  title: string;
  description: string;
  label: string;
  htmlFor: string;
  name: string;
  id: string;
  isChecked: boolean;
  setIsChecked: React.Dispatch<React.SetStateAction<boolean>>;
  setSectionCheckedBoxes: React.Dispatch<React.SetStateAction<string[]>>;
}

const EditProfileCheckBox: React.FC<EditProfileCheckBoxProps> = ({
  title,
  description,
  label,
  htmlFor,
  name,
  id,
  isChecked,
  setSectionCheckedBoxes,
}) => {
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
    <div className={styles['notifications-checkbox-container']}>
      <div className={styles['checkbox-container-text']}>
        <h4>{title}</h4>
        <p>{description}</p>
      </div>
      <div className={styles['input-container']}>
        <input
          type="checkbox"
          name={name}
          id={id}
          checked={isChecked}
          onChange={handleCheckboxChange}
        ></input>
        <label htmlFor={htmlFor}>{label}</label>
      </div>
    </div>
  );
};

export default EditProfileCheckBox;
