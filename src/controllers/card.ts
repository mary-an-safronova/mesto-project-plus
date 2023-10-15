import { Request, Response } from 'express';
import Card from '../models/card';

// Получение всех карточек
export const getCards = (req: Request, res: Response) => {
  return Card
    .find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

// Создание новой карточки
export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const userId = req.body.user._id;

  return Card
    .create({ name, link, owner: userId })
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: err.message }));
}

// Удаление карточки
export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card
    .findByIdAndDelete(cardId)
    .then(() => res.send({ message: `Карточка с _id ${cardId} удалена` }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
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
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
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
    .then((card) => res.status(200).send(card))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}