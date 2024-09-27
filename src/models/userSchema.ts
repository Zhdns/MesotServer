import mongoose, { Document } from 'mongoose';
import { CUSTOM_ERRORS, CUSTOM_VALIDATION_TEXT, urlRegex } from '../service/constants';

interface IUser extends Document {
    name: string;
    about: string;
    avatar: string;
    enail: string;
    password: string;
  }

const Users = new mongoose.Schema({
  name:
    {
      type: String,
      required: false,
      minlength: [2, CUSTOM_VALIDATION_TEXT.LESS_THEN_MIN],
      maxlength: [30, CUSTOM_VALIDATION_TEXT.MORE_THEN_MAX],
    },
  about: {
    type: String,
    required: false,
    minlength: [2, CUSTOM_VALIDATION_TEXT.LESS_THEN_MIN],
    maxlength: [30, CUSTOM_VALIDATION_TEXT.MORE_THEN_MAX],
  },
  avatar: {
    type: String,
    required: true,
    validate: {
      validator(v: string): boolean {
        return urlRegex.test(v);
      },
      message: CUSTOM_ERRORS.NO_VALID_LINK,
    },
  },
  email: { type: String, unique: true, required: true },
  password: {
    type: String,
    require: true,
    minlength: [8, CUSTOM_VALIDATION_TEXT.LESS_THEN_MIN],
    select: false,
  },
});

export default mongoose.model<IUser>('Users', Users);
