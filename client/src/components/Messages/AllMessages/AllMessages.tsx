import styles from './AllMessages.module.scss';
import ThreadCard from '../ThreadCard/ThreadCard';
import { useConversationContext } from '../../../hooks/useConversationContext';
import { useNavigate } from 'react-router-dom';

const AllMessages: React.FC = () => {
  const { conversations } = useConversationContext();
  const navigate = useNavigate();

  return (
    <div className={styles['all-messages-container']}>
      <header className={styles['messages-header']}>Messages</header>
      <div className={styles['threads']}>
        {conversations.length > 0 ? (
          <>
            {conversations?.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() =>
                  navigate(`/messages/${conversation.otherUser._id}`)
                }
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
          </>
        ) : (
          <div className={styles['no-threads-message']}>No conversations</div>
        )}
      </div>
    </div>
  );
};

export default AllMessages;
