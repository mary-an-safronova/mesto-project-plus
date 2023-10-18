import { Request, Response } from 'express';
import mongoose from 'mongoose';
import User from '../models/user';
import { STATUS_CODE, ERROR_MESSAGE } from '../utils/constants/errors';

// Получение всех пользовтелей
export const getUsers = (req: Request, res: Response) => User.find({})
  .select('name about avatar _id') // Поля, включенные в результат ответа
  .then((users) => {
    const updatedUsers = users.map((user: any) => {
      const updatedUser = {
        name: user?.name,
        about: user?.about,
        avatar: user?.avatar,
        _id: user?._id,
      };
      return updatedUser;
    });
    res.send(updatedUsers);
  })
  .catch(() => res.status(STATUS_CODE.InternalServerError)
    .send({ message: ERROR_MESSAGE.Error }));

// Получение одного пользователя по id
export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  return User
    .findById(userId)
    .orFail()
    .select('name about avatar _id') // Поля, включенные в результат ответа
    .then((user) => {
      res.send({
        name: user?.name,
        about: user?.about,
        avatar: user?.avatar,
        _id: user?._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        res.status(STATUS_CODE.BadRequest).send({ message: ERROR_MESSAGE.IncorrectId });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.UserNotFound });
      } else {
        res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error });
      }
    });
};

// Создание нового пользователя
export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  User
    .create({ name, about, avatar })
    .then((user) => res.status(STATUS_CODE.Created).send(user))
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(STATUS_CODE.BadRequest).send({ message: err.message });
      } else {
        res.status(STATUS_CODE.InternalServerError).send({ message: err.message });
      }
    });
};

// Изменение значений полей name и about пользователя
export const updateUserInfo = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const userId = req.user._id;

  return User
    .findByIdAndUpdate(userId, { name, about }, { new: true, runValidators: true })
    .orFail()
    .select('name about avatar _id') // Поля, включенные в результат ответа
    .then((user) => {
      res.send({
        name: user?.name,
        about: user?.about,
        avatar: user?.avatar,
        _id: user?._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(STATUS_CODE.BadRequest).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.UserNotFound });
      } else {
        res.status(STATUS_CODE.InternalServerError).send({ message: err.message });
      }
    });
};

// Изменение значения поля avatar пользователя
export const updateUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const userId = req.user._id;

  return User
    .findByIdAndUpdate(userId, { avatar }, { new: true, runValidators: true })
    .orFail()
    .select('name about avatar _id') // Поля, включенные в результат ответа
    .then((user) => {
      res.send({
        name: user?.name,
        about: user?.about,
        avatar: user?.avatar,
        _id: user?._id,
      });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.ValidationError) {
        res.status(STATUS_CODE.BadRequest).send({ message: err.message });
      } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
        res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.UserNotFound });
      } else {
        res.status(STATUS_CODE.InternalServerError).send({ message: err.message });
      }
    });
};
