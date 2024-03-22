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
import LargeLoadingSpinner from '../../LargeLoadingSpinner/LargeLoadingSpinner';
import { useConversationContext } from '../../../hooks/useConversationContext';
import { SocketContext } from '../../../context/SocketContext';
import { useContext } from 'react';
import { useParams } from 'react-router-dom';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

interface OtherUser {
  avatarUrl: string;
  displayName: string;
  _id: string;
}

const MessageThread: React.FC = () => {
  const { user } = useAuthContext();
  const { markConversationsAsRead, setMessagePreview, conversations } =
    useConversationContext();
  const socket = useContext(SocketContext);
  const { userIdToMessage } = useParams();
  const sendIcon: React.ReactNode = <FontAwesomeIcon icon={faPaperPlane} />;
  const [message, setMessage] = useState<string>('');
  const [error, setError] = useState<Error | null>(null);
  const [newMessages, setNewMessages] = useState<Message[]>([]);
  const [messageThread, setMessageThread] = useState<Message[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState<boolean>(false);
  const [otherUser, setOtherUser] = useState<OtherUser>({
    avatarUrl: '',
    displayName: '',
    _id: '',
  });

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    setOtherUser({
      avatarUrl: conversations[0].otherUser.avatarUrl,
      displayName: conversations[0].otherUser.displayName,
      _id: conversations[0].otherUser._id,
    });
  }, [conversations]);

  useEffect(() => {
    if (userIdToMessage) {
      setIsLoadingMessages(true);
      const fetchMessages = async (): Promise<void> => {
        const messagesResponse = await fetch(
          `${API_BASE_URL}/messages/${userIdToMessage}`,
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
          markConversationsAsRead(userIdToMessage);
        }
      };
      fetchMessages();
    } else {
      setMessageThread([]);
    }
  }, [userIdToMessage]);

  useEffect(() => {
    if (userIdToMessage) {
      scrollToBottom();
      markConversationsAsRead(userIdToMessage);
    }
  }, [newMessages, isLoadingMessages]);

  useEffect(() => {
    socket?.on('connect', () => {
      socket?.emit('userId', user.userId);
    });

    const handleReceiveMessage = (message: Message) => {
      setNewMessages((prevMessages) => [...prevMessages, message]);
      setMessagePreview(message);
    };

    socket?.on('receive-message', handleReceiveMessage);

    return () => {
      socket?.off('receive-message', handleReceiveMessage);
    };
  }, []);

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
      sender: {
        avatarUrl: user.avatarUrl,
        displayName: user.displayName,
        username: user.username,
        _id: user.userId,
      },
      recipient: otherUser,
      content: message,
      createdAt: new Date(),
      _id: uuidv4(),
      read: false,
    };

    displaySentMessage(newMessage);
    setMessagePreview(newMessage);

    try {
      const messageResponse = await fetch(
        `${API_BASE_URL}/messages/${userIdToMessage}`,
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
                    className={`${styles['message-details']} ${user.userId === message.sender._id ? styles.sender : styles.receiver}`}
                  >
                    <div
                      className={`${styles['message-bubble']} ${user.userId === message.sender._id ? styles.sender : styles.receiver}`}
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
                    className={`${styles['message-details']} ${user.userId === message.sender._id ? styles.sender : styles.receiver}`}
                  >
                    <div
                      className={`${styles['message-bubble']} ${user.userId === message.sender._id ? styles.sender : styles.receiver}`}
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
