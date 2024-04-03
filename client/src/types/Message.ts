interface Message {
  recipient: {
    avatarUrl: string | undefined;
    displayName: string | undefined;
    _id: string | undefined;
  };
  sender: {
    avatarUrl: string | undefined;
    displayName: string | undefined;
    _id: string | undefined;
  };
  content: string | undefined;
  createdAt: Date;
  read: boolean;
  _id: string | undefined;
}

export default Message;
