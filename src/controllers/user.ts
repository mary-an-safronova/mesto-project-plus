import { Request, Response } from 'express';
import User from '../models/user';
import { ERROR_STATUS, ERROR_MESSAGE } from '../utils/constants/errors';

// Получение всех пользовтелей
export const getUsers = (req: Request, res: Response) => {
  return User
    .find({})
    .then(users => res.send(users))
    .catch(() => res.status(ERROR_STATUS.InternalServerError).send({ message: ERROR_MESSAGE.Error }));
}

// Получение одного пользователя по id
export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  return User
    .findById(userId)
    .then(user => {
      if (!user) {
        res.status(ERROR_STATUS.NotFound).send({ message: ERROR_MESSAGE.UserNotFound });
      } else {
        res.send(user);
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

// Создание нового пользователя
export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User
    .create({ name, about, avatar })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_STATUS.BadRequest).send({ message: err.message });
      } else {
        res.status(ERROR_STATUS.InternalServerError).send({ message: err.message })
      }
    });
};

// Изменение значений полей name и about пользователя
export const updateUserInfo = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const userId = req.body.user._id;

  return User
    .findByIdAndUpdate(userId, { name, about }, { new: true })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_STATUS.BadRequest).send({ message: err.message });
      } else {
        res.status(ERROR_STATUS.InternalServerError).send({ message: err.message })
      }
    });
};

// Изменение значения поля avatar пользователя
export const updateUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const userId = req.body.user._id;

  return User
    .findByIdAndUpdate(userId, { avatar }, { new: true })
    .then(user => res.send(user))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        res.status(ERROR_STATUS.BadRequest).send({ message: err.message });
      } else {
        res.status(ERROR_STATUS.InternalServerError).send({ message: err.message })
      }
    });
};