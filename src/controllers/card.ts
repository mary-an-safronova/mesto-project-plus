import { Request, Response, NextFunction } from 'express';
import Card from '../models/card';
import { STATUS_CODE, ERROR_MESSAGE, MESSAGE } from '../utils/constants/errors';
import { cardFields, ownerFields, fields } from '../utils/constants/constants';
import { ForbiddenError, NotFoundError } from '../utils/errors';

// Функция-декоратор для обработки ошибок
const handleCardErrors = (fn: any) => async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    await fn(req, res, next);
  } catch (err) {
    next(err);
  }
};

// Получение всех карточек
export const getCards = async (req: Request, res: Response, next: NextFunction) => {
  const cards = await Card.find({})
    .select(cardFields) // Поля, включенные в результат ответа
    .populate(fields.owner, ownerFields) // Отображение инф. о пользователе в поле "owner" карточки
    .populate(fields.likes, ownerFields); // Отображение инф. о пользователе в поле "likes" карточки
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
};

export const getCardsController = handleCardErrors(getCards);

// Создание новой карточки
export const createCard = async (req: Request, res: Response, next: NextFunction) => {
  const { name, link } = req.body;
  const userId = req.user._id;

  const card = await Card.create({ name, link, owner: userId });
  const createdCard = await Card.findById(card._id)
    .select(cardFields) // Поля, включенные в результат ответа
    .populate(fields.owner, ownerFields); // Отображение инф. о пользователе в поле "owner" карточки
  const response = {
    createdAt: createdCard?.createdAt,
    likes: createdCard?.likes,
    link: createdCard?.link,
    name: createdCard?.name,
    owner: createdCard?.owner,
    _id: createdCard?._id,
  };

  res.status(STATUS_CODE.Created).send(response);
};

export const createCardController = handleCardErrors(createCard);

// Удаление карточки
export const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  const { cardId } = req.params;
  const ownerId = req.user._id;

  const card = await Card.findById(cardId).orFail(new NotFoundError(ERROR_MESSAGE.NotFound));
  if (card.owner.toString() === ownerId) {
    return Card.deleteOne({ _id: cardId }).then(() => {
      res.send({ message: MESSAGE.CardIsDelete });
    });
  }
  throw new ForbiddenError(ERROR_MESSAGE.AnotherUserCard);
};

export const deleteCardController = handleCardErrors(deleteCard);

// Добавление лайка карточке
export const likeCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  const card = await Card.findByIdAndUpdate(
    cardId,
    { $addToSet: { likes: userId } },
    { new: true },
  ).orFail(new NotFoundError(ERROR_MESSAGE.NotFound))
    .select(cardFields) // Поля, включенные в результат ответа
    .populate(fields.owner, ownerFields) // Отображение инф. о пользователе в поле "owner" карточки
    .populate(fields.likes, ownerFields); // Отображение инф. о пользователе в поле "likes" карточки
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
};

export const likeCardController = handleCardErrors(likeCard);

// Удаление лайка у карточки
export const dislikeCard = async (req: Request, res: Response) => {
  const { cardId } = req.params;
  const userId = req.user._id;

  const card = await Card.findByIdAndUpdate(
    cardId,
    { $pull: { likes: userId } },
    { new: true },
  ).orFail(new NotFoundError(ERROR_MESSAGE.NotFound));
  if (card?._id !== undefined) {
    const createdCard = await Card.findById(card?._id)
      .select(cardFields) // Поля, включенные в результат ответа
      .populate(fields.owner, ownerFields); // Отображение инф. о пользователе в поле "owner"
    const response = {
      createdAt: createdCard?.createdAt,
      likes: createdCard?.likes,
      link: createdCard?.link,
      name: createdCard?.name,
      owner: createdCard?.owner,
      _id: createdCard?._id,
    };
    return res.send(response);
  }
  return res.send();
};

export const dislikeCardController = handleCardErrors(dislikeCard);
