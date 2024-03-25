import styles from './ProjectCard.module.scss';
import { useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faEllipsisVertical,
  faFlag,
  faEye,
  faPenToSquare,
} from '@fortawesome/free-solid-svg-icons';
import { useState, useRef } from 'react';
import PopOutMenu from '../PopOutMenu/PopOutMenu';
import { useAuthContext } from '../../hooks/useAuthContext';
import useClickOutside from '../../hooks/useClickOutside';

interface ProjectCardProps {
  title: string;
  authorDisplayName: string;
  authorUsername: string;
  imageUrl: string;
  avatarUrl: string;
  projectId: string;
  published: boolean;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  authorDisplayName,
  authorUsername,
  imageUrl,
  avatarUrl,
  projectId,
  published,
}) => {
  const navigate = useNavigate();
  const { user } = useAuthContext();
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement>(null);

  const handleProjectClick = (
    e: React.MouseEvent<HTMLButtonElement | HTMLDivElement>,
  ): void => {
    e.preventDefault();
    navigate(`/project/${projectId}`);
  };

  const handleOptionClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    setIsMenuOpen(!isMenuOpen);
  };

  const handleMenuClose = (): void => {
    setIsMenuOpen(false);
  };

  const ellipsisIcon: React.ReactNode = (
    <FontAwesomeIcon icon={faEllipsisVertical} />
  );
  const reportIcon: React.ReactNode = <FontAwesomeIcon icon={faFlag} />;
  const viewIcon: React.ReactNode = <FontAwesomeIcon icon={faEye} />;
  const editIcon: React.ReactNode = <FontAwesomeIcon icon={faPenToSquare} />;

  const handleEditProjectClick = (
    e: React.MouseEvent<HTMLButtonElement>,
  ): void => {
    e.stopPropagation();
    navigate(`/project/edit/${projectId}`);
  };

  const reportProjectClick = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    console.log('project reported');
  };

  return (
    <div
      className={styles['project-card']}
      onClick={(e) => handleProjectClick(e)}
      ref={menuRef}
    >
      {isMenuOpen && (
        <div className={styles['popout-menu-container']}>
          <PopOutMenu
            buttons={[
              {
                icon: user?.username === authorUsername ? editIcon : reportIcon,
                label:
                  user?.username === authorUsername
                    ? 'Edit Project'
                    : 'Report Project',
                onClick: (e: React.MouseEvent<HTMLButtonElement>) =>
                  user?.username === authorUsername
                    ? handleEditProjectClick(e)
                    : reportProjectClick(e),
              },
              {
                icon: viewIcon,
                label: 'View Project',
                onClick: (e: React.MouseEvent<HTMLButtonElement>) =>
                  handleProjectClick(e),
              },
            ]}
            onClose={handleMenuClose}
          />
        </div>
      )}
      <div className={styles['card-options']}>
        <div>
          {!published && <div className={styles['not-published']}>Draft</div>}
        </div>
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
          <h5 className={styles.author}>{authorDisplayName}</h5>
        </div>
      </div>
      <div className={styles['card-overlay']}></div>
      <img className={styles['project-image']} src={imageUrl}></img>
    </div>
  );
};

export default ProjectCard;
