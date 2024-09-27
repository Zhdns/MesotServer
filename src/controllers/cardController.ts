/* eslint-disable no-unused-expressions */
/* eslint-disable class-methods-use-this */
/* eslint-disable consistent-return */
import { NextFunction, Request, Response } from 'express';
import { Error } from 'mongoose';
import validator from 'validator';
import Cards from '../models/cardSchema';
import Users from '../models/userSchema';
import { ErrorWithStatusCode } from '../service/types';
// eslint-disable-next-line import/named
import { CUSTOM_ERRORS, ERROR_CODE } from '../service/constants';
import { returnErr, throwErr, urlChecker } from '../service/utility';

class CardController {
  // eslint-disable-next-line class-methods-use-this
  async postCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { name, link } = req.body;
      const owner = req.user._id;
      if (!urlChecker(link)) {
        throwErr(ERROR_CODE.ER400, CUSTOM_ERRORS.NO_VALID_LINK);
      }
      await Users.findById(owner).orFail(() => {
        const error = returnErr(ERROR_CODE.ER404, CUSTOM_ERRORS.NO_USER_ERROR);
        throw error;
      });
      const card = await Cards.create({ name, link, owner });
      res.status(201).json(card);
    } catch (error) {
      next(error);
    }
  }

  async getAllCards(req: Request, res: Response) {
    try {
      const card = await Cards.find().sort({ _id: -1 }).limit(20);
      res.status(200).json(card);
    } catch (e) {
      res.status(500).json(CUSTOM_ERRORS.SERVER_ERROR);
    }
  }

  async deleteSelectedCard(req: Request, res: Response, next: NextFunction) {
    try {
      const owner = req.user._id;
      const { cardId } = req.params;
      await Cards.findById(cardId)
        .orFail(() => {
          const error = returnErr(ERROR_CODE.ER404, CUSTOM_ERRORS.NO_USER_ERROR);
          throw error;
        })
        .then((card) => {
          if (card.owner.toString() !== owner) {
            throwErr(ERROR_CODE.ER403, CUSTOM_ERRORS.CARD_NOT_BELONG);
          }
        });

      const deleteCard = await Cards.findByIdAndDelete(cardId);
      res.status(200).json(deleteCard);
    } catch (error) {
      next(error);
    }
  }

  async likeCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const updatedCard = await Cards.findByIdAndUpdate(
        cardId,
        { $addToSet: { likes: req.user._id } },
        { new: true },
      )
        .orFail(() => {
          const error = returnErr(ERROR_CODE.ER404, CUSTOM_ERRORS.NO_USER_OR_CARD_ERROR);
          throw error;
        });
      res.status(200).json(updatedCard);
    } catch (error) {
      next(error);
    }
  }

  async dislikeCard(req: Request, res: Response, next: NextFunction) {
    try {
      const { cardId } = req.params;
      const updatedCard = await Cards.findByIdAndUpdate(
        cardId,
        { $pull: { likes: req.user._id } as any },
        { new: true },
      )
        .orFail(() => {
          const error = returnErr(ERROR_CODE.ER404, CUSTOM_ERRORS.NO_USER_OR_CARD_ERROR);
          throw error;
        });

      res.status(200).json(updatedCard);
    } catch (error) {
      next(error);
    }
  }
}

export default new CardController();
