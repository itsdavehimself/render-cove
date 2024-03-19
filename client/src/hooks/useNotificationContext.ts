import { NotificationContext } from '../context/NotificationsContext';
import { useContext } from 'react';

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);

  if (!context) {
    throw new Error(
      'useNotificationContext must be used inside of a NotificationContextProvider',
    );
  }

  return context;
};
