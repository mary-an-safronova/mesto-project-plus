import { Router } from 'express';
import {
  getCardsController,
  createCardController,
  deleteCardController,
  likeCardController,
  dislikeCardController,
} from '../controllers/card';
import {
  validateDislikeCard,
  validateLikeCard,
  validateDeleteCard,
  validateCreateCard,
} from '../middlewares/validation';

const router = Router();

// Роуты карточек
router.get('/', getCardsController);
router.post('/', validateCreateCard, createCardController);
router.delete('/:cardId', validateDeleteCard, deleteCardController);
router.put('/:cardId/likes', validateLikeCard, likeCardController);
router.delete('/:cardId/likes', validateDislikeCard, dislikeCardController);

export default router;
