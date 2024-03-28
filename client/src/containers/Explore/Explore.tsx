import TagBar from '../../components/TagBar/TagBar';
import styles from './Explore.module.scss';
import { useEffect, useState } from 'react';
import Tag from '../../types/Tag';
import { Outlet } from 'react-router-dom';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const Explore: React.FC = () => {
  const [tags, setTags] = useState<Tag[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchTags = async () => {
      const tagsResponse = await fetch(`${API_BASE_URL}/tags/`, {
        method: 'GET',
      });

      const tagsJson = await tagsResponse.json();

      if (!tagsResponse.ok) {
        setError(tagsJson.error);
      }

      if (tagsResponse.ok) {
        setTags(tagsJson);
      }
    };

    fetchTags();
  }, []);

  return (
    <main className={styles['explore-page']}>
      <TagBar tags={tags} />
      <Outlet />
    </main>
  );
};

export default Explore;
