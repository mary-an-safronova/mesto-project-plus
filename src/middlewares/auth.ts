import { Request, Response, NextFunction } from 'express';
import jwt, { Secret } from 'jsonwebtoken';
import { MESSAGE, STATUS_CODE } from '../utils/constants/errors';
import { UnauthorizedError } from '../utils/errors';

export default (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;
  const { JWT_SECRET } = process.env;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    return res.status(STATUS_CODE.Unauthorized).send({ message: MESSAGE.NeedAutorization });
  }

  const token = authorization.replace('Bearer ', '');
  let payload: any;

  try {
    payload = jwt.verify(token, JWT_SECRET as Secret);
  } catch (err) {
    throw new UnauthorizedError(MESSAGE.NeedAutorization);
  }

  req.user = payload; // записываем пейлоуд в объект запроса

  return next(); // пропускаем запрос дальше
};
