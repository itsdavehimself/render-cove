interface Message {
  recipient: {
    avatarUrl: string;
    displayName: string;
    _id: string;
  };
  sender: {
    avatarUrl: string;
    displayName: string;
    _id: string;
  };
  content: string;
  createdAt: Date;
  read: boolean;
  _id: string;
}

export default Message;
