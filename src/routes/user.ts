import { Router } from 'express';
import {
  getUsersController,
  getUserController,
  updateUserInfoController,
  updateUserAvatarController,
  getCurrentUserController,
} from '../controllers/user';

const router = Router();

// Роуты пользователей
router.get('/', getUsersController);
router.get('/me', getCurrentUserController);
router.get('/:userId', getUserController);

router.patch('/me', updateUserInfoController);
router.patch('/me/avatar', updateUserAvatarController);

export default router;
