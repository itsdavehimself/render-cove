import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import mongoose from 'mongoose';

dotenv.config();

const app = express();

app.use(express.json());

app.use((req: Request, res: Response, next) => {
  console.log(req.path, req.method);
  next();
});

app.use('/api/users', usersRouter);

const mongoURI = process.env.MONGO_URI;

if (!mongoURI) {
  console.log(
    'MONGO_URI is not defined. Make sure it is set in your environment variables.'
  );
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(
        `Connected to MongoDB & listening on port ${process.env.PORT}`
      );
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
  });
