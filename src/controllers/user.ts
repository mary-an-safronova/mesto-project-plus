import { Request, Response } from 'express';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/user';
import { STATUS_CODE, ERROR_MESSAGE } from '../utils/constants/errors';

const sendUserResponse = (user: any, res: Response) => {
  res.send({
    name: user?.name,
    about: user?.about,
    avatar: user?.avatar,
    _id: user?._id,
  });
};

// Получение всех пользовтелей
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('name about avatar _id'); // Поля, включенные в результат ответа
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
  } catch (err) {
    res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error });
  }
};

// Получение одного пользователя по id
export const getUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).orFail().select('name about avatar _id'); // Поля, включенные в результат ответа
    sendUserResponse(user, res);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(STATUS_CODE.BadRequest).send({ message: ERROR_MESSAGE.IncorrectId });
    } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
      res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.UserNotFound });
    } else {
      res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error });
    }
  }
};

// Создание нового пользователя
export const createUser = async (req: Request, res: Response) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    // Хеширование пароля
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hashedPassword,
    });
    res.status(STATUS_CODE.Created).send(user);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(STATUS_CODE.BadRequest).send({ message: err.message });
    } else {
      res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error });
    }
  }
};

// Функция-декоратор для вынесения общих ошибок при обновлении данных пользователя
const handleUpdateUserErrors = (fn: any) => async (
  req: Request,
  res: Response,
) => {
  try {
    await fn(req, res);
  } catch (err) {
    if (err instanceof mongoose.Error.ValidationError) {
      res.status(STATUS_CODE.BadRequest).send({ message: err.message });
    } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
      res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.UserNotFound });
    } else {
      res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error });
    }
  }
};

// Общая логика изменения значений полей пользователя
const updateUserRequest = async (req: Request, res: Response, fields: any) => {
  const userId = req.user._id;

  const user = await User
    .findByIdAndUpdate(userId, fields, { new: true, runValidators: true })
    .orFail()
    .select('name about avatar _id'); // Поля, включенные в результат ответа

  sendUserResponse(user, res);
};

// Изменение значений полей name и about пользователя
const updateUserInfo = async (req: Request, res: Response) => {
  const { name, about } = req.body;
  await updateUserRequest(req, res, { name, about });
};

export const updateUserInfoController = handleUpdateUserErrors(updateUserInfo);

// Изменение значения поля avatar пользователя
const updateUserAvatar = async (req: Request, res: Response) => {
  const { avatar } = req.body;
  await updateUserRequest(req, res, { avatar });
};

export const updateUserAvatarController = handleUpdateUserErrors(updateUserAvatar);

// Аутентификация
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  const { JWT_SECRET } = process.env;

  try {
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign(
      { _id: user!._id },
      JWT_SECRET as Secret,
      { expiresIn: '7d' },
    );

    res.cookie('jwt', token, { httpOnly: true, maxAge: 3600000 * 24 * 7, sameSite: true });
    // аутентификация успешна!
    res.status(STATUS_CODE.OK).send({ user, token });
  } catch (err) {
    // ошибка аутентификации
    res.status(STATUS_CODE.Unauthorized).send({ message: ERROR_MESSAGE.AuthenticationError });
  }
};

// Получение данных текущего пользователя
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    const currentUserId = req.user._id;

    const user = await User.findById(currentUserId)
      .orFail().select('name about avatar _id'); // Поля, включенные в результат ответа
    sendUserResponse(user, res);
  } catch (err) {
    if (err instanceof mongoose.Error.CastError) {
      res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.UserNotFound });
    } else {
      res.status(STATUS_CODE.InternalServerError).send({ message: ERROR_MESSAGE.Error });
    }
  }
};
