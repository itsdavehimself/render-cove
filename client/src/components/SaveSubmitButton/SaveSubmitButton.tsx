import styles from './SaveSubmitButton.module.scss';

interface SaveSubmitButtonProps {
  icon?: React.ReactNode;
  label: string;
  isLoading: boolean;
  color: string;
}

const SaveSubmitButton: React.FC<SaveSubmitButtonProps> = ({
  icon,
  label,
  isLoading,
  color,
}) => {
  return (
    <button
      className={`${styles[`save-submit-button-${color}`]} ${isLoading ? styles['submitting'] : ''}`}
      disabled={isLoading}
    >
      {isLoading ? (
        <span className={styles['loader-spinner']}></span>
      ) : (
        <div className={styles['button-label']}>
          {icon && <span>{icon}</span>}
          <span>{label}</span>
        </div>
      )}
    </button>
  );
};

export default SaveSubmitButton;
