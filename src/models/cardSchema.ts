import mongoose, { Document, ObjectId } from 'mongoose';
import { CUSTOM_VALIDATION_TEXT, urlRegex, CUSTOM_ERRORS } from '../service/constants';

interface ICard extends Document {
    name: string,
    link: string,
    owner: ObjectId,
    likes: ObjectId[]
}

const Cards = new mongoose.Schema({
  name:
        {
          type: String,
          required: true,
          minlength: [2, CUSTOM_VALIDATION_TEXT.LESS_THEN_MIN],
          maxlength: [30, CUSTOM_VALIDATION_TEXT.MORE_THEN_MAX],
        },
  link: {
    type: String,
    required: true,
    validate: {
      validator(v: string) {
        return urlRegex.test(v);
      },
      message: CUSTOM_ERRORS.NO_VALID_LINK,
    },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'Users' },
  likes: { type: [mongoose.Schema.Types.ObjectId], ref: 'Users' },
  createdAt: { type: Date, default: Date.now },
}, { versionKey: false, timestamps: true });

export default mongoose.model<ICard>('Cards', Cards);
