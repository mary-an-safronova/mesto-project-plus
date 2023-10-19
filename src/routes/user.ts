import { Router } from 'express';
import {
  getUsers,
  getUser,
  updateUserInfoController,
  updateUserAvatarController,
  getCurrentUser,
} from '../controllers/user';

const router = Router();

// Роуты пользователей
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:userId', getUser);

router.patch('/me', updateUserInfoController);
router.patch('/me/avatar', updateUserAvatarController);

export default router;
