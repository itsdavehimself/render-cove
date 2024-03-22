import { createContext, useState, ReactNode } from 'react';
import Notification from '../types/Notification';
import { useEffect } from 'react';

interface NotificationsContextType {
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  unreadNotifications: number;
  fetchNotifications: () => void;
}

const NotificationContext = createContext<NotificationsContextType | null>(
  null,
);

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000';

const NotificationContextProvider = ({ children }: { children: ReactNode }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);

  const unreadCount = (notificationsArray: Notification[]) => {
    const count = notificationsArray.filter(
      (notification: Notification) => !notification.read,
    ).length;
    return count;
  };

  const addNotification = (notification: Notification) => {
    setNotifications((prevNotifications) => [
      notification,
      ...prevNotifications,
    ]);
    setUnreadNotifications((prevUnreadCount) => prevUnreadCount + 1);
  };

  const fetchNotifications = async () => {
    const user = localStorage.getItem('user');
    if (!user) {
      return;
    }
    const { token: userToken } = JSON.parse(user);

    try {
      const notificationsResponse = await fetch(
        `${API_BASE_URL}/notifications`,
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        },
      );

      if (notificationsResponse.ok) {
        const notificationJson = await notificationsResponse.json();
        setNotifications(notificationJson);
        setUnreadNotifications(unreadCount(notificationJson));
      } else {
        throw new Error('Failed to fetch notifications');
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadNotifications,
        addNotification,
        fetchNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export { NotificationContext, NotificationContextProvider };
