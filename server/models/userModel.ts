import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';

interface UserDocument {
  email: string;
  password: string;
  displayName: string;
  summary?: string;
  skills?: string[];
}

const userSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    displayName: {
      type: String,
      required: true,
      trim: true,
    },
    summary: {
      type: String,
      trim: true,
      default: '',
    },
    skills: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  { timestamps: true }
);

interface UserModel extends mongoose.Model<UserDocument> {
  signup(
    email: string,
    password: string,
    displayName: string
  ): Promise<UserDocument>;
}

userSchema.statics.signup = async function (email, password, displayName) {
  const emailExists = await this.findOne({ email });

  if (emailExists) {
    throw Error('Email already in use.');
  }

  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(password, salt);

  const user = await this.create({
    email,
    password: hash,
    displayName,
  });

  return user;
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User, UserDocument };
