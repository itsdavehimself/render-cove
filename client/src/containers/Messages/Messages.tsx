import AllMessages from '../../components/Messages/AllMessages/AllMessages';
import { ThreadIndexProvider } from '../../context/ThreadIndexContext';
import { UserInfoContextProvider } from '../../context/UserInfoContext';
import styles from './Messages.module.scss';
import { Outlet } from 'react-router-dom';

const Messages: React.FC = () => {
  return (
    <ThreadIndexProvider>
      <UserInfoContextProvider>
        <div className={styles['messages-container']}>
          <aside className={styles['all-messages']}>
            <AllMessages />
          </aside>
          <div className={styles['right-null']}>
            {/*Empty div for styling*/}
          </div>
          <main className={styles.thread}>
            <Outlet />
          </main>
        </div>
      </UserInfoContextProvider>
    </ThreadIndexProvider>
  );
};

export default Messages;
