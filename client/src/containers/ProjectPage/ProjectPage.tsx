import styles from './ProjectPage.module.scss';
import { useParams } from 'react-router-dom';

const ProjectPage: React.FC = () => {
  const { id } = useParams();

  return <div>Project {id}</div>;
};

export default ProjectPage;
