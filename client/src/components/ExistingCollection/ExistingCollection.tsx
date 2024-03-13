import styles from './ExistingCollection.module.scss';

interface ExistingCollectionProps {
  title: string;
  numberOfProjects: number;
}

const ExistingCollection: React.FC<ExistingCollectionProps> = ({
  title,
  numberOfProjects,
}) => {
  return (
    <div className={styles.collection}>
      <div className={styles['collection-header']}>
        <h4>{title}</h4>
        <p>
          {numberOfProjects} {numberOfProjects === 1 ? 'Project' : 'Projects'}
        </p>
      </div>
      <button className={styles['save-button']}>Save</button>
    </div>
  );
};

export default ExistingCollection;
