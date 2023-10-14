import { Request, Response } from 'express';
import Card from '../models/card';

export const getCards = (req: Request, res: Response) => {
  return Card
    .find({})
    .then(cards => res.send({ data: cards }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const userId = req.body.user._id

  return Card
    .create({ name, link, owner: userId })
    .then(card => res.send(card))
    .catch(err => res.status(500).send({ message: err.message }));
}

export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;

  return Card
    .findByIdAndDelete(cardId)
    .then(card => res.send({ message: `Карточка с _id ${cardId} удалена` }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}