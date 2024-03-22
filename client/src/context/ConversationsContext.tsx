import { createContext, useState, ReactNode } from 'react';
import { useEffect } from 'react';
import Message from '../types/Message';
import { SocketContext } from './SocketContext';
import { useContext } from 'react';
import { useAuthContext } from '../hooks/useAuthContext';
import LargeLoadingSpinner from '../components/LargeLoadingSpinner/LargeLoadingSpinner';

interface ConversationsContextType {
  conversations: Conversation[];
  numOfUnreadMessages: number;
  markConversationsAsRead: (otherUserId: string) => void;
  setMessagePreview: (message: Message) => void;
}

interface Conversation {
  content: string;
  createdAt: Date;
  otherUser: {
    avatarUrl: string;
    displayName: string;
    username: string;
    _id: string;
  };
  read: boolean;
  recipient: string;
  sender: string;
  unreadCount: number;
  _id: string;
}

const ConversationContext = createContext<ConversationsContextType | null>(
  null,
);

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const ConversationContextProvider = ({ children }: { children: ReactNode }) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [numOfUnreadMessages, setNumOfUnreadMessages] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const { user } = useAuthContext();
  const socket = useContext(SocketContext);

  const setMessagePreview = (message: Message) => {
    setConversations((prevConversations) =>
      prevConversations.map((conversation) => {
        if (
          (conversation.sender === message.sender._id &&
            conversation.recipient === message.recipient._id) ||
          (conversation.sender === message.recipient._id &&
            conversation.recipient === message.sender._id)
        ) {
          return {
            ...conversation,
            content: message.content,
            recipient: message.recipient._id,
            sender: message.sender._id,
            read: message.read,
            unreadCount: conversation.unreadCount + 1,
          };
        }
        return conversation;
      }),
    );
    setNumOfUnreadMessages((prevNumber) => prevNumber + 1);
  };

  useEffect(() => {
    if (user && user.userId) {
      socket?.on('connect', () => {
        socket?.emit('userId', user.userId);
      });

      socket?.on('receive-message', setMessagePreview);

      return () => {
        socket?.off('receive-message', setMessagePreview);
      };
    }
  }, [user]);

  const markAsReadOnServer = async (otherUserId: string) => {
    if (user && user.token) {
      try {
        const markAsReadResponse = await fetch(
          `${API_BASE_URL}/messages/${otherUserId}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        const markAsReadJson = await markAsReadResponse.json();

        if (!markAsReadResponse.ok) {
          console.error(markAsReadJson.error);
        }
      } catch (error) {
        console.error('Error marking as read:', error);
      }
    }
  };

  const markConversationsAsRead = (otherUserId: string) => {
    let totalUnreadCount = numOfUnreadMessages;

    const updatedConversations = conversations.map((conversation) => {
      if (
        (conversation.sender === otherUserId ||
          conversation.recipient === otherUserId) &&
        conversation.unreadCount > 0
      ) {
        totalUnreadCount -= conversation.unreadCount;

        return {
          ...conversation,
          unreadCount: 0,
          read: true,
        };
      }
      return conversation;
    });
    setConversations(updatedConversations);
    setNumOfUnreadMessages(totalUnreadCount);
    markAsReadOnServer(otherUserId);
  };

  const fetchConversations = async () => {
    setLoading(true);
    if (user && user.token) {
      try {
        const conversationsResponse = await fetch(
          `${API_BASE_URL}/messages/conversations`,
          {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${user.token}`,
            },
          },
        );

        const conversationsJson = await conversationsResponse.json();

        if (!conversationsResponse.ok) {
          console.error(conversationsJson.error);
        }

        if (conversationsResponse.ok) {
          setConversations(conversationsJson);
          const totalUnreadCount = conversationsJson.reduce(
            (total: number, conversation: Conversation) => {
              return total + conversation.unreadCount;
            },
            0,
          );
          setNumOfUnreadMessages(totalUnreadCount);
        }
      } catch (error) {
        console.error('Error fetching conversations:', error);
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  if (loading && user) {
    return <LargeLoadingSpinner />;
  }

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        numOfUnreadMessages,
        markConversationsAsRead,
        setMessagePreview,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
};

export { ConversationContext, ConversationContextProvider };
