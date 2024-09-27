import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import { MongoError } from 'mongodb';
import { CUSTOM_ERRORS } from '../service/constants';
import { ErrorWithStatusCode } from '../service/types';

const logger = require('../service/logger');

const errorCatcher = (error: Error, req: Request, res: Response, next: NextFunction) => {
  const customError = error as ErrorWithStatusCode;
  const mongooseErrorV = error as Error.ValidationError;
  const mongooseErrorC = error as Error.CastError;
  const mongoError = error as MongoError;

  if (customError.statusCode === 400) {
    logger.error('Error message: %s', error.message);
    return res.status(400).json(error.message);
  }

  if (customError.statusCode === 401) {
    logger.error('Error message: %s', error.message);
    return res.status(401).json(error.message);
  }

  if (customError.statusCode === 404) {
    logger.error('Error message: %s', error.message);
    return res.status(404).json(error.message);
  }

  if (mongooseErrorV?.name === CUSTOM_ERRORS.VALIDATION_ERROR) {
    logger.error('Error message: %s', error.message);
    return res.status(400).json({ message: mongooseErrorV.message });
  }

  if (mongooseErrorC?.name === CUSTOM_ERRORS.CAST_ERROR) {
    logger.error('Error message: %s', error.message);
    return res.status(400).json(error.message);
  }

  if (mongoError.code === 11000) {
    return res.status(409).json(CUSTOM_ERRORS.USED_EMAIL);
  }

  logger.error('Error message: %s', error.message);
  return res.status(500).json(CUSTOM_ERRORS.SERVER_ERROR_RUS);
};

export default errorCatcher;
