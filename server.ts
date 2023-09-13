import express from 'express';
import path from 'path';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
dotenv.config();

import rootRouter from './routes/root';
import userRouter from './routes/user';
import noteRouter from './routes/note';

import { logEvents, logger } from './middleware/logger';
import errorHandler from './middleware/errorHandler';
import corsOptions from './config/corsOptions';
import connectDB from './config/dbConn';

const app = express();
const PORT = process.env.PORT || 3500;
const NODE_ENV = process.env.NODE_ENV;

connectDB();
app.use(logger);
app.use(cookieParser());
app.use(cors(corsOptions as any));
app.use(express.json());
app.use('/', express.static(path.join(__dirname, 'public')));

app.use('/', rootRouter);
app.use('/users',userRouter);
app.use('/notes',noteRouter);

app.all('*', (req, res) => {
  if (req.accepts('html')) {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.status(404).json({ message: 'Page not found' });
  } else {
    res.type('text').send('Page not found');
  }
});

app.use(errorHandler);

mongoose.connection.once('open', () => {
  console.log('Mongodb Connected!');
  app.listen(PORT, () => {
    console.log(`Server running in ${NODE_ENV} mode on port ${PORT}`);
  });
});

mongoose.connection.on('error', (err) => {
  logEvents(
    `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
    'mongoError.log'
  );
});
