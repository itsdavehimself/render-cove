import styles from './ProjectCard.module.scss';

interface ProjectCardProps {
  imageUrl: string;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ imageUrl }) => {
  return (
    <div className={styles['project-card']}>
      <img className={styles['project-image']} src={imageUrl}></img>
    </div>
  );
};

export default ProjectCard;
