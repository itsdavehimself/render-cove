interface Notification {
  recipient: string;
  sender: {
    avatarUrl: string;
    displayName: string;
  };
  post: {
    title: string;
    _id: string;
  };
  type: string;
  read: boolean;
  createdAt: Date;
  _id: string;
}

export default Notification;
