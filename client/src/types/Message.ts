interface Message {
  recipient: string;
  sender: string;
  content: string;
  createdAt: Date;
  read: boolean;
  _id: string;
}

export default Message;
