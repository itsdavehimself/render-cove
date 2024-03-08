import { Types } from 'mongoose';

interface UserLike {
  projectId: Types.ObjectId;
  timestamp: Date;
}

export default UserLike;
