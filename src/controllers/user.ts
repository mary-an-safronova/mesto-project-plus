import { Request, Response } from 'express';
import User from '../models/user';

// Получение всех пользовтелей
export const getUsers = (req: Request, res: Response) => {
  return User
    .find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

// Получение одного пользователя по id
export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  return User
    .findById(userId)
    .then(user => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

// Создание нового пользователя
export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User
    .create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Изменение значений полей name и about пользователя
export const updateUserInfo = (req: Request, res: Response) => {
  const { name, about } = req.body;
  const userId = req.body.user._id;

  return User
    .findByIdAndUpdate(userId, { name, about }, { new: true })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: err.message }));
};

// Изменение значения поля avatar пользователя
export const updateUserAvatar = (req: Request, res: Response) => {
  const { avatar } = req.body;
  const userId = req.body.user._id;

  return User
    .findByIdAndUpdate(userId, { avatar }, { new: true })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: err.message }));
};