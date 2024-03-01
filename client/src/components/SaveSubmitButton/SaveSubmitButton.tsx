import styles from './SaveSubmitButton.module.scss';

interface SaveSubmitButtonProps {
  label: string;
  isLoading: boolean;
  color: string;
}

const SaveSubmitButton: React.FC<SaveSubmitButtonProps> = ({
  label,
  isLoading,
  color,
}) => {
  return (
    <button
      className={`${styles[`save-submit-button-${color}`]} ${isLoading ? styles['submitting'] : ''}`}
      disabled={isLoading}
    >
      {isLoading ? <span className={styles['loader-spinner']}></span> : label}
    </button>
  );
};

export default SaveSubmitButton;
