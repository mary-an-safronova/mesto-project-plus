import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt, { Secret } from 'jsonwebtoken';
import User from '../models/user';
import { STATUS_CODE, ERROR_MESSAGE } from '../utils/constants/errors';
import {
  userFields, defaultSecretKey, TokenMaxAge, CookieMaxAge,
} from '../utils/constants/constants';
import { NotFoundError, ConflictError, UnauthorizedError } from '../utils/errors';

const sendUserResponse = (user: any, res: Response) => {
  res.send({
    name: user?.name,
    about: user?.about,
    avatar: user?.avatar,
    _id: user?._id,
  });
};

// Функция-декоратор для вынесения общих ошибок
const handleUserErrors = (fn: any) => async (
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

// Получение всех пользовтелей
const getUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({}).select(userFields); // Поля, включенные в результат ответа
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
    if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(ERROR_MESSAGE.AuthenticationError);
    }
  }
};

export const getUsersController = handleUserErrors(getUsers);

// Получение одного пользователя по id
const getUser = async (req: Request, res: Response, next: NextFunction) => {
  const { userId } = req.params;
  try {
    const user = await User.findById(userId).orFail(new NotFoundError(ERROR_MESSAGE.NotFound))
      .select(userFields); // Поля, включенные в результат ответа
    sendUserResponse(user, res);
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(ERROR_MESSAGE.AuthenticationError);
    }
  }
};

export const getUserController = handleUserErrors(getUser);

// Создание нового пользователя
const createUser = async (req: Request, res: Response, next: NextFunction) => {
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

    return res.status(STATUS_CODE.Created).send(user);
  } catch (err: any) {
    if (err.code === 11000) {
      throw new ConflictError(ERROR_MESSAGE.MailAlreadyExists);
    }
    return next(err);
  }
};

export const createUserController = handleUserErrors(createUser);

// Общая логика изменения значений полей пользователя
const updateUserRequest = async (req: Request, res: Response, next: NextFunction, fields: any) => {
  const userId = req.user._id;

  const user = await User
    .findByIdAndUpdate(userId, fields, { new: true, runValidators: true })
    .orFail(new NotFoundError(ERROR_MESSAGE.NotFound))
    .select(userFields); // Поля, включенные в результат ответа

  sendUserResponse(user, res);
};

// Изменение значений полей name и about пользователя
const updateUserInfo = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    await updateUserRequest(req, res, next, { name, about });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(ERROR_MESSAGE.AuthenticationError);
    }
  }
};

export const updateUserInfoController = handleUserErrors(updateUserInfo);

// Изменение значения поля avatar пользователя
const updateUserAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    await updateUserRequest(req, res, next, { avatar });
  } catch (err) {
    if (err instanceof jwt.JsonWebTokenError) {
      throw new UnauthorizedError(ERROR_MESSAGE.AuthenticationError);
    }
  }
};

export const updateUserAvatarController = handleUserErrors(updateUserAvatar);

// Аутентификация
export const login = async (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body;
  const JWT_SECRET = process.env.NODE_ENV ? process.env.JWT_SECRET : defaultSecretKey;

  const user = await User.findUserByCredentials(email, password);
  const token = jwt.sign(
    { _id: user!._id },
    JWT_SECRET as Secret,
    { expiresIn: TokenMaxAge },
  );

  res.cookie('jwt', token, { httpOnly: true, maxAge: CookieMaxAge, sameSite: true });
  res.status(STATUS_CODE.OK).send({ token });
};

export const loginController = handleUserErrors(login);

// Получение данных текущего пользователя
const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  const currentUserId = req.user._id;

  const user = await User.findById(currentUserId)
    .orFail(new NotFoundError(ERROR_MESSAGE.NotFound))
    .select(userFields); // Поля, включенные в результат ответа
  sendUserResponse(user, res);
};

export const getCurrentUserController = handleUserErrors(getCurrentUser);
