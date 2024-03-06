import styles from './ProjectCard.module.scss';
import { useNavigate } from 'react-router-dom';

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

  const handleProjectClick = (): void => {
    navigate(`/project/${projectId}`);
  };

  return (
    <div className={styles['project-card']} onClick={handleProjectClick}>
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
