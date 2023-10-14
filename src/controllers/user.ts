import { Request, Response } from 'express';
import User from '../models/user';

export const getUsers = (req: Request, res: Response) => {
  return User
    .find({})
    .then(users => res.send({ data: users }))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const getUser = (req: Request, res: Response) => {
  const { userId } = req.params;

  return User
    .findById(userId)
    .then(user => res.send(user))
    .catch(() => res.status(500).send({ message: 'Произошла ошибка' }));
}

export const createUser = (req: Request, res: Response) => {
  const { name, about, avatar } = req.body;

  return User
    .create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => res.status(500).send({ message: err.message }));
};