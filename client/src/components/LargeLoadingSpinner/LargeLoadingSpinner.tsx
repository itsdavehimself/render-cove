import styles from './LargeLoadingSpinner.module.scss';

const LargeLoadingSpinner: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.spinner}></div>
    </div>
  );
};

export default LargeLoadingSpinner;
