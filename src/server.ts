// this file was generated after running the command typeorm init --database postgres

import 'reflect-metadata';
import { createConnection } from 'typeorm';
import express from 'express';
import morgan from 'morgan';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

import authRoutes from './routes/auth';
import postRoutes from './routes/posts';
import subRoutes from './routes/subs';
import miscRoutes from './routes/misc';
import userRoutes from './routes/users';
import trim from './middleware/trim';

const app = express();
const PORT = process.env.PORT;

app.use(cors({ origin: 'http://139.59.168.190', credentials: true }));
app.use(express.json());
app.use(morgan('dev'));
app.use(trim);
app.use(cookieParser());
app.use(
  cors({
    credentials: true,
    origin: process.env.ORIGIN,
    optionsSuccessStatus: 200,
  })
);

// making public directory availabl
app.use(express.static('public'));

// we do not need to declare the types for req and res here as they are inferred
app.get('/api', (_, res) => {
  res.send('hello world');
});
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/subs', subRoutes);
app.use('/api/misc', miscRoutes);
app.use('/api/users', userRoutes);

app.listen(PORT, async () => {
  console.log(`Server running at http://localhost:${PORT}`);

  try {
    await createConnection();
    console.log('Database connected');
  } catch (err) {
    console.log(err);
  }
});
