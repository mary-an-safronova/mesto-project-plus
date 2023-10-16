import { Router } from 'express';
import {
  getUsers, getUser, createUser, updateUserInfo, updateUserAvatar,
} from '../controllers/user';

const router = Router();

// Роуты пользователей
router.get('/', getUsers);
router.get('/:userId', getUser);
router.post('/', createUser);
router.patch('/me', updateUserInfo);
router.patch('/me/avatar', updateUserAvatar);

export default router;
