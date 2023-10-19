import { Router } from 'express';
import {
  getCardsController,
  createCardController,
  deleteCardController,
  likeCardController,
  dislikeCardController,
} from '../controllers/card';

const router = Router();

// Роуты карточек
router.get('/', getCardsController);
router.post('/', createCardController);
router.delete('/:cardId', deleteCardController);
router.put('/:cardId/likes', likeCardController);
router.delete('/:cardId/likes', dislikeCardController);

export default router;
