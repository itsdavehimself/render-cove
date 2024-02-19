import styles from './SaveSubmitButton.module.scss';

interface SaveSubmitButtonProps {
  label: string;
  isLoading: boolean;
}

const SaveSubmitButton: React.FC<SaveSubmitButtonProps> = ({
  label,
  isLoading,
}) => {
  return (
    <button
      className={`${styles['save-submit-button']} ${isLoading ? styles['submitting'] : ''}`}
      disabled={isLoading}
    >
      {isLoading ? <span className={styles['loader-spinner']}></span> : label}
    </button>
  );
};

export default SaveSubmitButton;
