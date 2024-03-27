import { Link } from 'react-router-dom';
import Notification from '../../types/Notification';
import styles from './NotificationsPopout.module.scss';
import { formatDistanceToNowStrict } from 'date-fns';
import { useNotificationContext } from '../../hooks/useNotificationContext';
import { useEffect } from 'react';
import { useAuthContext } from '../../hooks/useAuthContext';
import { markAsRead } from '../../utility/Notifications.utility';

interface NotificationPopoutProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const NotificationPopout: React.FC<NotificationPopoutProps> = ({
  setIsOpen,
}) => {
  const { notifications, fetchNotifications } = useNotificationContext();
  const { user } = useAuthContext();

  useEffect(() => {
    return () => {
      markAsRead(user, fetchNotifications);
    };
  }, []);

  return (
    <div className={styles['notification-popout']}>
      <div className={styles.header}>
        Notifications
        <Link
          className={styles['view-all']}
          to="/notifications"
          onClick={() => setIsOpen(false)}
        >
          See all
        </Link>
      </div>
      {notifications.length > 0 ? (
        <>
          {notifications.slice(0, 9).map((notification: Notification) => (
            <Link
              to={
                notification.type === 'follow'
                  ? `/user/${notification.sender.username}`
                  : `/project/${notification.post?._id}`
              }
              key={notification._id}
              onClick={() => setIsOpen(false)}
            >
              <div className={styles['notification']}>
                <div className={styles['avatar-container']}>
                  <img
                    className={styles.avatar}
                    src={notification.sender.avatarUrl}
                  />
                </div>
                <div className={styles['notification-text']}>
                  <div className={styles['notification-details']}>
                    <span className={styles.emphasized}>
                      {notification.sender.displayName}
                    </span>{' '}
                    {notification.type === 'like'
                      ? 'liked your post'
                      : notification.type === 'comment'
                        ? 'commented on your post'
                        : 'followed you'}{' '}
                    {notification.type !== 'follow' && (
                      <span className={styles.emphasized}>
                        {notification.post.title}
                      </span>
                    )}
                  </div>
                  <p className={styles['date']}>
                    {formatDistanceToNowStrict(notification.createdAt)} ago
                  </p>
                </div>
                {notification.read === false && (
                  <div className={styles.new}></div>
                )}
              </div>
            </Link>
          ))}
        </>
      ) : (
        <div className={styles.empty}>No notifications.</div>
      )}
    </div>
  );
};

export default NotificationPopout;
