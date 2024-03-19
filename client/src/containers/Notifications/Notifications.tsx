import styles from './Notifications.module.scss';
import { useNotificationContext } from '../../hooks/useNotificationContext';
import { Link } from 'react-router-dom';
import { formatDistanceToNowStrict } from 'date-fns';
import { useEffect } from 'react';
import { markAsRead } from '../../utility/Notifications.utility';
import { useAuthContext } from '../../hooks/useAuthContext';

const Notifications: React.FC = () => {
  const { notifications, fetchNotifications } = useNotificationContext();
  const { user } = useAuthContext();

  useEffect(() => {
    return () => {
      markAsRead(user, fetchNotifications);
    };
  }, []);
  return (
    <main className={styles.notifications}>
      {notifications.length > 0 ? (
        <>
          <section className={styles['notifications-container']}>
            <h2 className={styles.header}>Notifications</h2>

            {notifications.map((notification) => (
              <Link
                to={`/project/${notification.post._id}`}
                key={notification._id}
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
                      liked your post{' '}
                      <span className={styles.emphasized}>
                        {notification.post.title}
                      </span>
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
          </section>
        </>
      ) : (
        <section className={styles['notifications-container']}>
          <p className={styles.empty}>No notifications</p>
        </section>
      )}
    </main>
  );
};

export default Notifications;
