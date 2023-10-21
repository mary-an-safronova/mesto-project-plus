import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { defaultSecretKey } from '../utils/constants/constants';
import { ERROR_MESSAGE } from '../utils/constants/errors';
import { UnauthorizedError } from '../utils/errors';

export default (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.jwt; // Извлечение токена из куки
  const JWT_SECRET = process.env.NODE_ENV ? process.env.JWT_SECRET : defaultSecretKey;

  if (!token) {
    throw new UnauthorizedError(ERROR_MESSAGE.NeedAutorization);
  }

  let payload: any;

  try {
    payload = jwt.verify(token, JWT_SECRET as Secret);
  } catch (err) {
    throw new UnauthorizedError(ERROR_MESSAGE.NeedAutorization);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
