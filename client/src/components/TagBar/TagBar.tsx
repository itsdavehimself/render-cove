import React, { useEffect, useState, useRef } from 'react';
import styles from './TagBar.module.scss';
import Tag from '../../types/Tag';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';

interface TagBarProps {
  tags: Tag[];
}

const TagBar: React.FC<TagBarProps> = ({ tags }) => {
  const [maxScroll, setMaxScroll] = useState<number>(0);
  const [scrollPosition, setScrollPosition] = useState(0);
  const { tag } = useParams();
  const tagUrl = tag;

  const tagbarRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const updateMaxScroll = () => {
    if (tagbarRef.current && containerRef.current) {
      const tagbarWidth = tagbarRef.current.offsetWidth;
      const containerWidth = containerRef.current.offsetWidth;
      setMaxScroll(tagbarWidth - containerWidth);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (tagbarRef.current && containerRef.current) {
        const tagbarWidth = tagbarRef.current.offsetWidth;
        const containerWidth = containerRef.current.offsetWidth;
        setMaxScroll(tagbarWidth - containerWidth);
        setScrollPosition(0);
      }
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [tags]);

  useEffect(() => {
    updateMaxScroll();
  }, []);

  const rightArrow: React.ReactNode = <FontAwesomeIcon icon={faAngleRight} />;
  const leftArrow: React.ReactNode = <FontAwesomeIcon icon={faAngleLeft} />;

  const slideLeft = (): void => {
    const newPosition = scrollPosition - 300;
    setScrollPosition(Math.max(newPosition, 0));
  };

  const slideRight = (): void => {
    const newPosition = scrollPosition + 300;
    setScrollPosition(Math.min(newPosition, maxScroll));
  };

  return (
    <nav className={styles['tag-bar']}>
      <button className={styles['arrow-button']} onClick={slideLeft}>
        {leftArrow}
      </button>
      <div className={styles['tags-container']} ref={containerRef}>
        <div
          className={styles['tags']}
          ref={tagbarRef}
          style={{
            transform: `translateX(-${scrollPosition}px)`,
            transition: 'transform 0.3s ease-in-out',
          }}
        >
          {tags.map((tag) => (
            <button
              className={`${styles['tag-button']} ${tag.name === tagUrl ? styles['active'] : ''}`}
              key={tag._id}
              type="button"
              onClick={() => navigate(`/explore/${tag.name}`)}
            >
              {tag.name
                .split(' ')
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(' ')}
            </button>
          ))}
        </div>
      </div>
      <button className={styles['arrow-button']} onClick={slideRight}>
        {rightArrow}
      </button>
    </nav>
  );
};

export default TagBar;
