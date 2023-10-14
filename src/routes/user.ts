import { Router } from 'express';
import { getUsers, getUser, createUser } from '../controllers/user';

const router = Router();

router.get('/', getUsers);
router.get('/:userId', getUser)
router.post('/', createUser);

export default router;