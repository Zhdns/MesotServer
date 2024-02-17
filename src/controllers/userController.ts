/* eslint-disable consistent-return */
/* eslint-disable class-methods-use-this */
import { NextFunction, Request, Response } from 'express';
import { Error, ObjectId } from 'mongoose';
import validator from 'validator';
import { CUSTOM_ERRORS } from '../service/constants';
import { defaultAbout, defaultName, urlChecker } from '../service/utility';
import Users from '../models/userSchema';
import { ErrorWithStatusCode } from '../service/types';

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JwtKey } = require('../service/jwtKey');

const generateToken = (_id: ObjectId) => {
  const payload = {
    _id,
  };
  return jwt.sign(payload, JwtKey, { expiresIn: '24h' });
};

class UserController {
  async registration(req: Request, res: Response, next: NextFunction) {
    try {
      let { name, about } = req.body;
      name = defaultName(name);
      about = defaultAbout(about);
      const { avatar, email, password } = req.body;
      const vaildEmail = validator.isEmail(email);
      if (!vaildEmail) {
        const error = new Error(CUSTOM_ERRORS.NO_VALID_EMAIL) as ErrorWithStatusCode;
        error.statusCode = 400;
        throw error;
      }
      if (!urlChecker(avatar)) {
        const error = new Error(CUSTOM_ERRORS.NO_VALID_LINK) as ErrorWithStatusCode;
        error.statusCode = 400;
        throw error;
      }
      const hashPassword = await bcrypt.hash(password, 6);
      const user = await Users.create({
        name, about, avatar, email, password: hashPassword,
      });
      return res.status(201).json(user);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email }).select('+password').orFail(() => {
        const error = new Error(CUSTOM_ERRORS.NO_USER_ERROR) as ErrorWithStatusCode;
        error.statusCode = 400;
        throw error;
      });
      const validPass = await bcrypt.compare(password, user.password);
      if (!validPass) {
        const error = new Error(CUSTOM_ERRORS.NO_PASSWORD) as ErrorWithStatusCode;
        error.statusCode = 400;
        throw error;
      }
      const token = generateToken(user._id);
      return res.status(200).json({ token });
    } catch (error) {
      next(error);
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await Users.find();
      res.status(200).json(users);
    } catch (erorr) {
      return res.status(500).json(CUSTOM_ERRORS.SERVER_ERROR);
    }
  }

  async updateName(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      let { name, about } = req.body;
      name = defaultName(name);
      about = defaultAbout(about);
      // eslint-disable-next-line max-len
      const user = await Users.findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true }).orFail(() => {
        const error = new Error(CUSTOM_ERRORS.NO_USER_ERROR) as ErrorWithStatusCode;
        error.statusCode = 404;
        throw error;
      });

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async updateAvatar(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const { avatar } = req.body;
      if (!urlChecker(avatar)) {
        const error = new Error(CUSTOM_ERRORS.NO_VALID_LINK) as ErrorWithStatusCode;
        error.statusCode = 400;
        throw error;
      }
      const user = await Users.findByIdAndUpdate(userId, { avatar }, { new: true }).orFail(() => {
        const error = new Error(CUSTOM_ERRORS.NO_USER_ERROR) as ErrorWithStatusCode;
        error.statusCode = 404;
        throw error;
      });

      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }

  async getUserByID(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.user._id;
      const user = await Users.findById(userId)
        .orFail(() => {
          const error = new Error(CUSTOM_ERRORS.NO_USER_ERROR) as ErrorWithStatusCode;
          error.statusCode = 404;
          throw error;
        });
      return res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
}

export default new UserController();
