import styles from './ErrorAlert.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faXmark } from '@fortawesome/free-solid-svg-icons';

interface ErrorAlertProps {}

const ErrorAlert: React.FC<ErrorAlertProps> = () => {
  const xMark: React.ReactNode = <FontAwesomeIcon icon={faXmark} />;

  return (
    <div className={styles['fail-alert']}>
      <div className={`${styles['status-icon']}`}>{xMark}</div>
      <div>Something went wrong. Please try again.</div>
    </div>
  );
};

export default ErrorAlert;
