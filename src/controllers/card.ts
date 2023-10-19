import { Request, Response } from 'express';
import mongoose from 'mongoose';
import Card from '../models/card';
import { STATUS_CODE, ERROR_MESSAGE, MESSAGE } from '../utils/constants/errors';

// Получение всех карточек
export const getCards = (req: Request, res: Response) => Card
  .find({})
  .select('createdAt likes name link owner _id') // Поля, включенные в результат ответа
  .populate('owner', 'name about avatar _id') // Отображение информации о пользователе в поле "owner" карточки
  .populate('likes', 'name about avatar _id') // Отображение информации о пользователе в поле "likes" карточки
  .then((cards) => {
    const updatedCards = cards.map((card: any) => {
      const updatedCard = {
        createdAt: card.createdAt,
        likes: card.likes?.map((like: any) => ({
          name: like.name,
          about: like.about,
          avatar: like.avatar,
          _id: like._id,
        })),
        link: card.link,
        name: card.name,
        owner: {
          name: card.owner.name,
          about: card.owner.about,
          avatar: card.owner.avatar,
          _id: card.owner._id,
        },
        _id: card._id,
      };
      return updatedCard;
    });
    res.send(updatedCards);
  })
  .catch(() => res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error }));

// Создание новой карточки
export const createCard = (req: Request, res: Response) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  return Card
    .create({ name, link, owner: userId })
    .then((card) => Card.findById(card._id)
      .select('createdAt likes name link owner _id') // Поля, включенные в результат ответа
      .populate('owner', 'name about avatar _id') // Отображение информации о пользователе в поле "owner" карточки
      .then((createdCard) => {
        const response = {
          createdAt: createdCard?.createdAt,
          likes: createdCard?.likes,
          link: createdCard?.link,
          name: createdCard?.name,
          owner: createdCard?.owner,
          _id: createdCard?._id,
        };
        res.status(STATUS_CODE.Created).send(response);
      })
      .catch(() => res.status(STATUS_CODE.InternalServerError)
        .send({ message: ERROR_MESSAGE.Error })))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(STATUS_CODE.BadRequest).send({ message: err.message });
      } else {
        res.status(STATUS_CODE.InternalServerError).send({ message: err.message });
      }
    });
};

// Удаление карточки
export const deleteCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;

  return Card
    .findByIdAndDelete(cardId)
    .orFail()
    .then((card) => {
      if (card?._id !== undefined && card.owner.toString() === ownerId) {
        res.send({ message: MESSAGE.CardIsDelete });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(STATUS_CODE.BadRequest).send({ message: ERROR_MESSAGE.IncorrectId });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.CardNotFound });
      } else {
        res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error });
      }
    });
};

// Добавление лайка карточке
export const likeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $addToSet: { likes: userId } },
      { new: true },
    )
    .orFail()
    .select('createdAt likes name link owner _id') // Поля, включенные в результат ответа
    .populate('owner', 'name about avatar _id') // Отображение информации о пользователе в поле "owner" карточки
    .populate('likes', 'name about avatar _id') // Отображение информации о пользователе в поле "likes" карточки
    .then((card) => {
      if (card?._id !== undefined) {
        res.send({
          createdAt: card?.createdAt,
          likes: card.likes?.map((like: any) => ({
            name: like.name,
            about: like.about,
            avatar: like.avatar,
            _id: like._id,
          })),
          link: card?.link,
          name: card?.name,
          owner: card?.owner,
          _id: card?._id,
        });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(STATUS_CODE.BadRequest).send({ message: ERROR_MESSAGE.IncorrectId });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.CardNotFound });
      } else {
        res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error });
      }
    });
};

// Удаление лайка у карточки
export const dislikeCard = (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  return Card
    .findByIdAndUpdate(
      cardId,
      { $pull: { likes: userId } },
      { new: true },
    )
    .orFail()
    .then((card) => {
      if (card?._id !== undefined) {
        Card
          .findById(card?._id)
          .select('createdAt likes name link owner _id') // Поля, включенные в результат ответа
          .populate('owner', 'name about avatar _id') // Отображение информации о пользователе в поле "owner" карточки
          .then((createdCard) => {
            const response = {
              createdAt: createdCard?.createdAt,
              likes: createdCard?.likes,
              link: createdCard?.link,
              name: createdCard?.name,
              owner: createdCard?.owner,
              _id: createdCard?._id,
            };
            return res.send(response);
          });
      }
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(STATUS_CODE.BadRequest).send({ message: ERROR_MESSAGE.IncorrectId });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.CardNotFound });
      } else {
        res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error });
      }
    });
};
