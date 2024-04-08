import styles from './AllMessages.module.scss';
import ThreadCard from '../ThreadCard/ThreadCard';
import { useConversationContext } from '../../../hooks/useConversationContext';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const AllMessages: React.FC = () => {
  const { conversations } = useConversationContext();
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 550);
    };

    handleResize();

    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleClick = (conversationId: string | undefined) => {
    const url = isMobile
      ? `/messages/thread/${conversationId}`
      : `/messages/${conversationId}`;
    navigate(url);
  };

  return (
    <div className={styles['all-messages-container']}>
      <header className={styles['messages-header']}>Messages</header>
      <div className={styles['threads']}>
        {conversations.length > 0 ? (
          <>
            {conversations.map((conversation) => (
              <div
                key={conversation._id}
                onClick={() => handleClick(conversation.otherUser._id)}
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
