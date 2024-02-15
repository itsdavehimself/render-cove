import NavBar from '../Navbar/Navbar';
import { Outlet } from 'react-router';

const WithNav: React.FC = () => {
  return (
    <>
      <NavBar />
      <Outlet />
    </>
  );
};

export default WithNav;
