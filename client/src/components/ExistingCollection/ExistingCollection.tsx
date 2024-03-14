import styles from './ExistingCollection.module.scss';

interface ExistingCollectionProps {
  title: string;
  numberOfProjects: number;
  saveToCollection: () => Promise<void>;
  isSaved: boolean;
  isLoading: boolean;
}

const ExistingCollection: React.FC<ExistingCollectionProps> = ({
  title,
  numberOfProjects,
  saveToCollection,
  isSaved,
  isLoading,
}) => {
  return (
    <div className={styles.collection}>
      <div className={styles['collection-header']}>
        <h4>{title}</h4>
        <p>
          {numberOfProjects} {numberOfProjects === 1 ? 'Project' : 'Projects'}
        </p>
      </div>
      <button
        className={`${styles['save-button']} ${isSaved ? styles.saved : ''}`}
        onClick={saveToCollection}
      >
        {isLoading ? (
          <span className={styles['loader-spinner']}></span>
        ) : (
          <> {isSaved ? 'Saved' : 'Save'}</>
        )}
      </button>
    </div>
  );
};

export default ExistingCollection;
