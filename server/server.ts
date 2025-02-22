import express from 'express';
import dotenv from 'dotenv';
import usersRouter from './routes/users.js';
import projectsRouter from './routes/projects.js';
import mongoose from 'mongoose';
import cors from 'cors';
import userAuthRouter from './routes/userAuth.js';
import collectionsRouter from './routes/collections.js';
import followersRouter from './routes/followers.js';
import http from 'http';
import { Server } from 'socket.io';
import notificationsRouter from './routes/notifications.js';
import messagesRouter from './routes/messages.js';
import tagsRouter from './routes/tags.js';
import searchRouter from './routes/search.js';
import { createProjectIndex, createUserIndex } from './createIndexes.js';

dotenv.config();
console.log('🔥 Loaded ORIGIN from env:', process.env.ORIGIN);

const app = express();
const server = http.createServer(app);

app.use(
  cors({
    origin: [
      'http://localhost:5173',
      process.env.ORIGIN || 'http://yourfrontend.com',
    ],
  })
);

app.use(express.json());

app.get('/', (req, res) => {
  res.send('Server is up!');
});

app.use('/api/users', usersRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/auth', userAuthRouter);
app.use('/api/collections', collectionsRouter);
app.use('/api/followers', followersRouter);
app.use('/api/notifications', notificationsRouter);
app.use('/api/messages', messagesRouter);
app.use('/api/tags', tagsRouter);
app.use('/api/search', searchRouter);

const mongoURI = process.env.MONGO_URI || '';

if (!mongoURI) {
  console.error(
    'MONGO_URI is not defined. Make sure it is set in your environment variables.'
  );
  process.exit(1);
}

mongoose
  .connect(mongoURI)
  .then(() => {
    const PORT = Number(process.env.PORT) || 8080;

    server.listen(PORT, '0.0.0.0', () => {
      console.log(`Connected to MongoDB & listening on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1);
  });

const io = new Server(server, {
  cors: {
    origin: [
      'http://localhost:5173',
      process.env.ORIGIN || 'http://yourfrontend.com',
    ],
  },
});

io.on('connection', (socket) => {
  console.log('A user connected');

  socket.on('userId', (userId) => {
    socket.join(userId);
    console.log(`Socket ${socket.id} joined room ${userId}`);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

createProjectIndex();
createUserIndex();

export { io };
