import AllMessages from '../../components/Messages/AllMessages/AllMessages';
import MessageThread from '../../components/Messages/MessageThread/MessageThread';
import styles from './Messages.module.scss';
import { useState, useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import Message from '../../types/Message';
import { useConversationContext } from '../../hooks/useConversationContext';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const Messages: React.FC = () => {
  const { user } = useAuthContext();
  const { conversations, markConversationsAsRead } = useConversationContext();
  const [currentThread, setCurrentThread] = useState<string>('');
  const [messageThread, setMessageThread] = useState<Message[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);

  useEffect(() => {
    if (currentThread) {
      setIsLoadingMessages(true);
      const fetchMessages = async (): Promise<void> => {
        const messagesResponse = await fetch(
          `${API_BASE_URL}/messages/${currentThread}`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        const messagesJson = await messagesResponse.json();

        if (!messagesResponse.ok) {
          setError(messagesJson.error);
          setIsLoadingMessages(false);
        }

        if (messagesResponse.ok) {
          setMessageThread(messagesJson);
          setIsLoadingMessages(false);
          markConversationsAsRead(currentThread);
        }
      };
      fetchMessages();
    }
  }, [currentThread, user.token]);

  return (
    <div className={styles['messages-container']}>
      <aside className={styles['all-messages']}>
        <AllMessages setCurrentThread={setCurrentThread} />
      </aside>
      <div className={styles['right-null']}>{/*Empty div for styling*/}</div>
      <main className={styles.thread}>
        {currentThread ? (
          <MessageThread
            messageThread={messageThread}
            recipientId={currentThread}
            isLoadingMessages={isLoadingMessages}
            otherUser={conversations[0].otherUser}
          />
        ) : (
          <div className={styles['empty-message']}>
            It's a little quiet in here. Start a conversation!
          </div>
        )}
      </main>
    </div>
  );
};

export default Messages;
