import { Request, Response } from 'express';
import Card from '../models/card';
import { ERROR_STATUS, ERROR_MESSAGE } from '../utils/constants/errors';

// Получение всех карточек
export const getCards = (req: Request, res: Response) => {
  return Card
    .find({})
    .then(cards => res.send(cards))
    .catch(() => res.status(ERROR_STATUS.InternalServerError).send({ message: ERROR_MESSAGE.Error }));
}

// Создание новой карточки
export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const userId = req.body.user._id;

  return Card
    .create({ name, link, owner: userId })
    .then(card => res.send({ data: card }))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_STATUS.BadRequest).send({ message: err.message });
      } else {
        res.status(ERROR_STATUS.InternalServerError).send({ message: err.message })
      }
    });
}

// Удаление карточки
export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card
    .findByIdAndDelete(cardId)
    .then((card) => {
      if (card?._id !== undefined) {
        res.send({ message: ERROR_MESSAGE.CardIsDelete })
      } else {
        res.status(ERROR_STATUS.NotFound).send({ message: ERROR_MESSAGE.CardNotFound });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_STATUS.BadRequest).send({ message: ERROR_MESSAGE.IncorrectId });
      } else {
        res.status(ERROR_STATUS.InternalServerError).send({ message: ERROR_MESSAGE.Error })
      }
    });
}

// Добавление лайка карточке
export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.body.user._id;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
    .then((card) => {
      if (card?._id !== undefined) {
        return res.send(card)
      } else {
        res.status(ERROR_STATUS.NotFound).send({ message: ERROR_MESSAGE.CardNotFound });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_STATUS.BadRequest).send({ message: ERROR_MESSAGE.IncorrectId });
      } else {
        res.status(ERROR_STATUS.InternalServerError).send({ message: ERROR_MESSAGE.Error })
      }
    });
}

// Удаление лайка у карточки
export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.body.user._id;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true }
    )
    .then((card) => {
      if (card?._id !== undefined) {
        return res.send(card)
      } else {
        res.status(ERROR_STATUS.NotFound).send({ message: ERROR_MESSAGE.CardNotFound });
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_STATUS.BadRequest).send({ message: ERROR_MESSAGE.IncorrectId });
      } else {
        res.status(ERROR_STATUS.InternalServerError).send({ message: ERROR_MESSAGE.Error })
      }
    });
}