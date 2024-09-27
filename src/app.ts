import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import { CUSTOM_ERRORS } from './service/constants';
import cardRoute from './routes/cardRoute';
import userRoute from './routes/userRoute';
import { ErrorWithStatusCode } from './service/types';

const PORT = 3000;
const DB_URL = 'mongodb+srv://user:user@mestoserver.380lwqj.mongodb.net/?retryWrites=true&w=majority';
const DB_LOCAL = 'mongodb://localhost:27017/mestodb ';
const app = express();
app.use(express.json());
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const logger = require('./service/logger');

// eslint-disable-next-line no-multi-assign
const logStream = fs.createWriteStream(path.join(__dirname, 'request.log'), { flags: 'a' });

app.get('/', (req: Request, res: Response) => {
  res.status(200).json('AVADA KEDAVRA');
});
app.get('/error', (req: Request, res: Response) => {
  throw new Error('Test Error');
});

app.use(morgan('combined', { stream: logStream }));
app.use('/', cardRoute);
app.use('/', userRoute);
app.use('*', (req: Request, res: Response) => {
  res.status(404).json(CUSTOM_ERRORS.NO_PAGE);
});

async function startApp() {
  try {
    await mongoose.connect(DB_URL);
    app.listen(PORT, () => {
      console.log(`SERVER ON PORT${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
}

startApp();
