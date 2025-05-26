import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { connectDb } from './database/db.js';
import http from 'http';
import { Server } from 'socket.io';


import userRoute from './routes/userRoutes.js';
import storyRoute from './routes/storyRoutes.js';
import postRoute from './routes/postRoutes.js';
import followRoute from './routes/followRoutes.js';
import CommentRoute from './routes/commentRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';

import { createNotification } from './utils/createNotification.js';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json());
app.use(cookieParser());

// API Routes
app.use('/api', userRoute);
app.use('/api/stories', storyRoute);
app.use('/api/posts', postRoute);
app.use('/api/follow', followRoute);
app.use('/api/comments', CommentRoute);
app.use('/api/message', messageRoutes);
app.use('/api/notification', notificationRoutes);


const users = new Map();

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join', (userId) => {
    users.set(socket.id, userId);
    console.log(`User ${userId} joined with socket ${socket.id}`);
  });

  socket.on('sendMessage', ({ senderId, receiverId, message }) => {
    console.log(`Message from ${senderId} to ${receiverId}: ${message}`);

    for (let [socketId, userId] of users.entries()) {
      if (userId === receiverId) {
        io.to(socketId).emit('receiveMessage', { senderId, message });
      }
    }
  });

  socket.on(
    'sendNotification',
    async ({ senderId, receiverId, type, postId = null }) => {
      try {
        await createNotification(receiverId, senderId, type, postId);
        for (let [socketId, userId] of users.entries()) {
          if (userId === receiverId) {
            io.to(socketId).emit('receiveNotification', {
              senderId,
              type,
              postId,
            });
          }
        }
      } catch (error) {
        console.error('Error handling sendNotification:', error);
      }
    },
  );

  socket.on('disconnect', () => {
    users.delete(socket.id);
    console.log('User disconnected:', socket.id);
  });
});


server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  connectDb();
});
