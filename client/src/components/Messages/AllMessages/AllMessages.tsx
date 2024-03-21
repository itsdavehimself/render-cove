import styles from './AllMessages.module.scss';
import { useAuthContext } from '../../../hooks/useAuthContext';
import ThreadCard from '../ThreadCard/ThreadCard';

interface AllMessagesProps {
  setCurrentThread: React.Dispatch<React.SetStateAction<string>>;
}

const AllMessages: React.FC<AllMessagesProps> = ({ setCurrentThread }) => {
  const { user } = useAuthContext();

  return (
    <div className={styles['all-messages-container']}>
      <header className={styles['messages-header']}>Messages</header>
      <div className={styles['threads']}>
        {user.messages.map((message) => (
          <div
            key={message._id}
            onClick={() => setCurrentThread(message.withUser._id)}
          >
            <ThreadCard
              displayName={message.withUser.displayName}
              avatarUrl={message.withUser.avatarUrl}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMessages;
