import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import validator from 'validator';

interface UserDocument {
  email: string;
  password: string;
  displayName: string;
  summary?: string;
  skills?: string[];
  _id: string;
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
  login(email: string, password: string): Promise<UserDocument>;
}

userSchema.statics.signup = async function (
  email,
  password,
  displayName
): Promise<UserDocument> {
  if (!email || !password || !displayName) {
    throw Error('All fields are required.');
  }

  if (!validator.isEmail(email)) {
    throw Error('Please enter a valid email address.');
  }

  if (!validator.isStrongPassword(password)) {
    throw Error('Password is not strong enough.');
  }

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

userSchema.statics.login = async function (
  email,
  password
): Promise<UserDocument> {
  if (!email || !password) {
    throw Error('All fields are required.');
  }

  const user: UserDocument = await this.findOne({ email });

  if (!user) {
    throw Error('Invalid email or password. Please try again.');
  }

  const passwordMatch: boolean = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    throw Error('Invalid email or password. Please try again.');
  }

  return user;
};

const User = mongoose.model<UserDocument, UserModel>('User', userSchema);

export { User, UserDocument };
