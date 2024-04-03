import { UserType } from '../context/AuthContext';

const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:4000/api';

const markAsRead = async (
  user: UserType | null,
  fetchNotifications: () => void,
): Promise<void> => {
  const readResponse = await fetch(`${API_BASE_URL}/notifications/markAsRead`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  });

  const readJson = await readResponse.json();

  if (!readResponse.ok) {
    console.error(readJson.error);
  }

  if (readResponse.ok) {
    fetchNotifications();
  }
};

export { markAsRead };
