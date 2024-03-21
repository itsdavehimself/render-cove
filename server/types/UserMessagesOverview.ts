import { Types } from 'mongoose';

interface UserMessagesOverview {
  withUser: Types.ObjectId;
  unreadCount: number;
}

export default UserMessagesOverview;
