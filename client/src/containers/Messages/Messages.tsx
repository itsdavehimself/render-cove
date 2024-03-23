import AllMessages from '../../components/Messages/AllMessages/AllMessages';
import { UserInfoContextProvider } from '../../context/UserInfoContext';
import styles from './Messages.module.scss';
import { Outlet } from 'react-router-dom';

const Messages: React.FC = () => {
  return (
    <UserInfoContextProvider>
      <div className={styles['messages-container']}>
        <aside className={styles['all-messages']}>
          <AllMessages />
        </aside>
        <div className={styles['right-null']}>{/*Empty div for styling*/}</div>
        <main className={styles.thread}>
          <Outlet />
        </main>
      </div>
    </UserInfoContextProvider>
  );
};

export default Messages;
