import styles from './ViewCollection.module.scss';
import { useEffect, useState } from 'react';
import ProjectCard from '../ProjectCard/ProjectCard';
import { useParams } from 'react-router-dom';
import Collection from '../../types/Collection';

interface ViewCollectionProps {}

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const ViewCollection: React.FC<ViewCollectionProps> = () => {
  const { collectionId } = useParams();
  const [error, setError] = useState<Error | null>(null);
  const [collection, setCollection] = useState<Collection>({
    title: '',
    creator: '',
    projects: [],
    createdAt: new Date(),
    private: false,
    _id: '',
  });

  useEffect(() => {
    const fetchCollectionInfo = async (): Promise<void> => {
      const collectionInfoResponse = await fetch(
        `${API_BASE_URL}/collections/single/${collectionId}`,
        {
          method: 'GET',
        },
      );

      const collectionInfoJson = await collectionInfoResponse.json();

      if (!collectionInfoResponse.ok) {
        setError(collectionInfoJson.error);
      }

      if (collectionInfoResponse.ok) {
        setCollection(collectionInfoJson);
      }
    };

    fetchCollectionInfo();
  }, [collectionId]);

  return (
    <main className={styles['view-collection-container']}>
      <div className={styles.header}>
        <h1>{collection.title}</h1>
        <p>View all the projects in this collection below</p>
      </div>
      <section>
        {collection && (
          <>
            {collection.projects.map((project) => (
              <ProjectCard
                title={project?.title}
                authorDisplayName={project?.author.displayName}
                authorUsername={project?.author.username}
                imageUrl={project?.images[0].url}
                avatarUrl={project?.author.avatarUrl}
                projectId={project?._id}
                published={true}
                key={project?._id}
              />
            ))}
          </>
        )}
      </section>
    </main>
  );
};

export default ViewCollection;
