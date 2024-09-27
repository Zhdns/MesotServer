import { Router } from 'express';
import CardController from '../controllers/cardController';
import auth from '../middleware/auth';
import errorCatcher from '../middleware/errorCatcher';

const cardRoute = Router();

cardRoute.get('/cards', CardController.getAllCards, errorCatcher);
cardRoute.post('/cards', auth, CardController.postCard, errorCatcher);
cardRoute.delete('/cards/:cardId', auth, CardController.deleteSelectedCard, errorCatcher);
cardRoute.put('/cards/:cardId/likes', auth, CardController.likeCard, errorCatcher);
cardRoute.delete('/cards/:cardId/likes', auth, CardController.dislikeCard, errorCatcher);

export default cardRoute;
