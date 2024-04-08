import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import AllMessages from '../../components/Messages/AllMessages/AllMessages';
import styles from './Messages.module.scss';
import { Outlet } from 'react-router-dom';

const Messages: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () => {
      if (
        location.pathname.startsWith('/messages/') &&
        window.innerWidth < 768
      ) {
        const userIdToMessage = location.pathname.split('/').pop();
        navigate(`/messages/thread/${userIdToMessage}`);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [location.pathname, navigate]);

  return (
    <div className={styles['messages-container']}>
      <aside className={styles['all-messages']}>
        <AllMessages />
      </aside>
      <div className={styles['right-null']}>{/*Empty div for styling*/}</div>
      <main className={styles.thread}>
        <Outlet />
      </main>
    </div>
  );
};

export default Messages;
