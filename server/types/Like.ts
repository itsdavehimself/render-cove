import { Types } from 'mongoose';

interface Like {
  userId: Types.ObjectId;
  timestamp: Date;
}

export default Like;
