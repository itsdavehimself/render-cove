import { Types } from 'mongoose';

interface Like {
  userId: Types.ObjectId;
  timestamp: Date;
  _id: Types.ObjectId;
}

export default Like;
