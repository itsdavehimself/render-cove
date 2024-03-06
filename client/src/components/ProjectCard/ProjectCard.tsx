import styles from './ProjectCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faFlag,
  faEye,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import PopOutMenu from '../PopOutMenu/PopOutMenu';

interface ProjectCardProps {
  title: string;
  author: string;
  imageUrl: string;
  avatarUrl: string;
  projectId: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  author,
  imageUrl,
  avatarUrl,
  projectId,
}) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);

  const handleProjectClick = (): void => {
    navigate(`/project/${projectId}`);
  };

  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const ellipsisIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faEllipsisVertical} />
  );
  const reportIcon: React.ReactNode = <FontAwesomeIcon icon={faFlag} />;
  const viewIcon: React.ReactNode = <FontAwesomeIcon icon={faEye} />;

  return (
    <div className={styles['project-card']} onClick={handleProjectClick}>
      {isMenuOpen && (
        <div className={styles['popout-menu-container']}>
          <PopOutMenu
            buttons={[
              {
                icon: reportIcon,
                label: 'Report Project',
                onClick: () => console.log('project reported'),
              },
              {
                icon: viewIcon,
                label: 'View Project',
                onClick: () => handleProjectClick,
              },
            ]}
          />
        </div>
      )}
      <div className={styles['card-options']}>
        <button
          className={styles['options-button']}
          onClick={handleOptionClick}
        >
          {ellipsisIcon}
        </button>
      </div>
      <div className={styles.info}>
        <div className={styles['avatar-container']}>
          <img className={styles.avatar} src={avatarUrl}></img>
        </div>
        <div className={styles['project-info']}>
          <h4 className={styles.title}>{title}</h4>
          <h5 className={styles.author}>{author}</h5>
        </div>
      </div>
      <div className={styles['card-overlay']}></div>
      <img className={styles['project-image']} src={imageUrl}></img>
    </div>
  );
};

export default ProjectCard;
