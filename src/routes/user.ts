import { Router } from 'express';
import {
  getUsersController,
  getUserController,
  updateUserInfoController,
  updateUserAvatarController,
  getCurrentUserController,
} from '../controllers/user';
import {
  validateUpdateUserInfo,
  validateUpdateUserAvatar,
  validateGetUser,
} from '../middlewares/validation';

const router = Router();

// Роуты пользователей
router.get('/', getUsersController);
router.get('/me', getCurrentUserController);
router.get('/:userId', validateGetUser, getUserController);

router.patch('/me', validateUpdateUserInfo, updateUserInfoController);
router.patch('/me/avatar', validateUpdateUserAvatar, updateUserAvatarController);

export default router;
