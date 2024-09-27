import { NextFunction, Request, Response } from 'express';
import { ErrorWithStatusCode } from '../service/types';

const jwt = require('jsonwebtoken');
const { JwtKey } = require('../service/jwtKey');

const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) {
    const error = new Error('TOKEN ERROR') as ErrorWithStatusCode;
    error.statusCode = 401;
    throw error;
  }
  try {
    const verified = jwt.verify(token, JwtKey);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).send('Неверный токен.');
  }
};

export default auth;
