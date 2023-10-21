import { NextFunction, Request, Response } from 'express';
import { STATUS_CODE, ERROR_MESSAGE } from '../utils/constants/errors';

export interface IError extends Error {
  statusCode: number
}

const centralizedError = (err: IError, req: Request, res: Response, next: NextFunction) => {
  const { statusCode = STATUS_CODE.InternalServerError, message } = err;

  const errorMessage = statusCode === STATUS_CODE.InternalServerError
    ? ERROR_MESSAGE.Error
    : message;

  res.status(statusCode).send({ message: errorMessage });
};

export default centralizedError;
