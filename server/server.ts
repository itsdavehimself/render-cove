import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import projectsRouter from './routes/projects.js';
import mongoose from 'mongoose';
import cors from 'cors';
import userAuthRouter from './routes/userAuth.js';
import collectionsRouter from './routes/collections.js';

dotenv.config();

const app = express();

app.use(cors({ origin: true, credentials: true }));

app.use(express.json());

app.use('/api/users', usersRouter);

app.use('/api/projects', projectsRouter);

app.use('/api/auth', userAuthRouter);

app.use('/api/collections', collectionsRouter);

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
