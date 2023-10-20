import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import { STATUS_CODE, ERROR_MESSAGE } from '../utils/constants/errors';

// Middleware для централизованной обработки ошибок
export default (err: any, req: Request, res: Response, next: NextFunction) => {
  // Определение статуса и сообщения об ошибке
  let statusCode = STATUS_CODE.InternalServerError; // Внутренняя ошибка сервера
  let errorMessage = ERROR_MESSAGE.Error;

  if (err instanceof mongoose.Error.ValidationError) {
    statusCode = STATUS_CODE.BadRequest; // Плохой запрос
    errorMessage = err.message;
  } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
    statusCode = STATUS_CODE.NotFound; // Не найдено
    errorMessage = ERROR_MESSAGE.NotFound;
  } else if (err instanceof mongoose.Error.CastError) {
    statusCode = STATUS_CODE.BadRequest; // Некорректные данные
    errorMessage = ERROR_MESSAGE.IncorrectData;
  } else if (err instanceof jwt.JsonWebTokenError) {
    statusCode = STATUS_CODE.Unauthorized; // Неавторизовано
    errorMessage = ERROR_MESSAGE.AuthenticationError;
  } else if (err.code === 11000) {
    statusCode = STATUS_CODE.Conflict; // Почта уже есть в базе
    errorMessage = ERROR_MESSAGE.MailAlreadyExists;
  } else if (err.message === ERROR_MESSAGE.IncorrectEmailOrPassword) {
    statusCode = STATUS_CODE.BadRequest; // Плохой запрос
    errorMessage = ERROR_MESSAGE.IncorrectEmailOrPassword;
  }

  // Отправка ответа с соответствующим статусом и сообщением об ошибке
  res.status(statusCode).json({ error: errorMessage });

  return next(); // пропускаем запрос дальше
};
