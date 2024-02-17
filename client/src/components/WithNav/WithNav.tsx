import NavBar from '../Navbar/Navbar';
import { Outlet } from 'react-router';
import styles from './WithNav.module.scss';

const WithNav: React.FC = () => {
  return (
    <>
      <NavBar />
      <div className={styles['added-margin']}>
        <Outlet />
      </div>
    </>
  );
};

export default WithNav;
