import styles from './AllMessages.module.scss';
import ThreadCard from '../ThreadCard/ThreadCard';
import { useConversationContext } from '../../../hooks/useConversationContext';
import { useNavigate } from 'react-router-dom';
import { useThreadIndexContext } from '../../../hooks/useThreadIndexContext';

const AllMessages: React.FC = () => {
  const { conversations } = useConversationContext();
  const navigate = useNavigate();
  const { setThreadIndex } = useThreadIndexContext();

  const handleClickThread = (id: string, index: number) => {
    setThreadIndex(index);
    navigate(`/messages/${id}`);
  };

  return (
    <div className={styles['all-messages-container']}>
      <header className={styles['messages-header']}>Messages</header>
      <div className={styles['threads']}>
        {conversations.length > 0 ? (
          <>
            {conversations?.map((conversation, index) => (
              <div
                key={conversation._id}
                onClick={() =>
                  handleClickThread(conversation.otherUser._id, index)
                }
              >
                <ThreadCard
                  displayName={conversation.otherUser.displayName}
                  avatarUrl={conversation.otherUser.avatarUrl}
                  id={conversation.otherUser._id}
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
