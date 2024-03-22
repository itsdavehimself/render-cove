import styles from './AllMessages.module.scss';
import ThreadCard from '../ThreadCard/ThreadCard';
import { useConversationContext } from '../../../hooks/useConversationContext';

interface AllMessagesProps {
  setCurrentThread: React.Dispatch<React.SetStateAction<string>>;
}

const AllMessages: React.FC<AllMessagesProps> = ({ setCurrentThread }) => {
  const { conversations } = useConversationContext();

  return (
    <div className={styles['all-messages-container']}>
      <header className={styles['messages-header']}>Messages</header>
      <div className={styles['threads']}>
        {conversations?.map((conversation) => (
          <div
            key={conversation._id}
            onClick={() => setCurrentThread(conversation.otherUser._id)}
          >
            <ThreadCard
              displayName={conversation.otherUser.displayName}
              avatarUrl={conversation.otherUser.avatarUrl}
              sender={conversation.sender}
              lastMessage={conversation.content}
              updatedAt={conversation.createdAt}
              unreadCount={conversation.unreadCount}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllMessages;
