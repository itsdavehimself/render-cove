import FormInput from '../../FormInput/FormInput';
import SaveSubmitButton from '../../SaveSubmitButton/SaveSubmitButton';
import styles from './MessageThread.module.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { FormEvent, useState, useEffect, useRef } from 'react';
import Message from '../../../types/Message';
import { formatDistanceToNowStrict } from 'date-fns';
import { useAuthContext } from '../../../hooks/useAuthContext';
import { v4 as uuidv4 } from 'uuid';
import { io } from 'socket.io-client';
import LargeLoadingSpinner from '../../LargeLoadingSpinner/LargeLoadingSpinner';

interface MessageThreadProps {
  messageThread: Message[];
  recipientId: string;
  isLoadingMessages: boolean;
}

interface MessageWithDelivered extends Message {
  delivered: boolean;
}

type CombinedMessage = Message | MessageWithDelivered;

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const API_SOCKET_URL: string =
  import.meta.env.VITE_SOCKET_URL || 'ws://localhost:4000';

const MessageThread: React.FC<MessageThreadProps> = ({
  messageThread,
  recipientId,
  isLoadingMessages,
}) => {
  const { user } = useAuthContext();
  const socket = io(API_SOCKET_URL);
  const sendIcon: React.ReactNode = <FontAwesomeIcon icon={faPaperPlane} />;
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [newMessages, setNewMessages] = useState<CombinedMessage[]>([]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [isLoadingMessages]);

  useEffect(() => {
    scrollToBottom();
  }, [newMessages]);

  useEffect(() => {
    socket.on('connect', () => {
      socket.emit('userId', user.userId);
    });

    const handleReceiveMessage = (message: Message) => {
      setNewMessages((prevMessages) => [...prevMessages, message]);
    };

    socket.on('receive-message', handleReceiveMessage);

    return () => {
      socket.off('receive-message', handleReceiveMessage);
    };
  }, [socket, user.userId]);

  const displaySentMessage = (newMessage: Message) => {
    setNewMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');
  };

  const handleSendMessage = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    const trimmedMessage = message.trim();

    if (trimmedMessage === '') {
      return;
    }

    const newMessage = {
      sender: user.userId,
      recipient: recipientId,
      content: message,
      delivered: false,
      createdAt: new Date(),
      _id: uuidv4(),
      read: false,
    };

    displaySentMessage(newMessage);

    try {
      const messageResponse = await fetch(
        `${API_BASE_URL}/messages/${recipientId}`,
        {
          method: 'POST',
          body: JSON.stringify({ message }),
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${user.token}`,
          },
        },
      );

      const messageJson = await messageResponse.json();

      if (!messageResponse.ok) {
        setError(messageJson.error);
      } else {
        setNewMessages((prevMessages) => {
          return prevMessages.map((msg) => {
            if (msg._id === newMessage._id) {
              return { ...msg, delivered: true };
            }
            return msg;
          });
        });
      }
    } catch (error) {
      setError(new Error('Failed to send message'));
    }
  };

  return (
    <div className={styles['messages-window']}>
      {isLoadingMessages ? (
        <LargeLoadingSpinner />
      ) : (
        <>
          <div className={styles['message-thread-container']}>
            <div className={styles['message-thread']}>
              {messageThread.map((message) => (
                <div
                  className={`${styles['message-container']}`}
                  key={message._id}
                >
                  <div
                    className={`${styles['message-details']} ${user.userId === message.sender ? styles.sender : styles.receiver}`}
                  >
                    <div
                      className={`${styles['message-bubble']} ${user.userId === message.sender ? styles.sender : styles.receiver}`}
                    >
                      {message.content}
                    </div>
                    <div className={styles['date']}>
                      {formatDistanceToNowStrict(message.createdAt)} ago
                    </div>
                  </div>
                </div>
              ))}
              {newMessages.map((message) => (
                <div
                  className={`${styles['message-container']}`}
                  key={message._id}
                >
                  <div
                    className={`${styles['message-details']} ${user.userId === message.sender ? styles.sender : styles.receiver}`}
                  >
                    <div
                      className={`${styles['message-bubble']} ${user.userId === message.sender ? styles.sender : styles.receiver}`}
                    >
                      {message.content}
                    </div>
                    <div className={styles['date']}>
                      {formatDistanceToNowStrict(message.createdAt)} ago
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div ref={messagesEndRef} />
          </div>
          <div className={styles['message-input']}>
            <form
              onSubmit={handleSendMessage}
              className={styles['message-form']}
            >
              <FormInput
                htmlFor="message"
                type="text"
                id="message"
                name="message"
                value={message}
                placeholder="Type message here..."
                onChange={(e) => setMessage(e.target.value)}
                autoComplete="off"
              />
              <SaveSubmitButton
                icon={sendIcon}
                label="Send"
                isLoading={false}
                color="blue"
              />
            </form>
          </div>
        </>
      )}
    </div>
  );
};

export default MessageThread;
