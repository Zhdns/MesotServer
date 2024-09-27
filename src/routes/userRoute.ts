import { Router } from 'express';
import userController from '../controllers/userController';
import auth from '../middleware/auth';
import errorCatcher from '../middleware/errorCatcher';

const userRoute = Router();

userRoute.post('/singup', userController.registration, errorCatcher);
userRoute.post('/singin', userController.login, errorCatcher);
userRoute.get('/users', auth, userController.getAllUsers, errorCatcher);
userRoute.patch('/users/me', auth, userController.updateName, errorCatcher);
userRoute.patch('/users/me/avatar', auth, userController.updateAvatar, errorCatcher);
userRoute.get('/users/:userId', auth, userController.getUserByID, errorCatcher);

export default userRoute;
