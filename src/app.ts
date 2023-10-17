import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/user';
import cardsRouter from './routes/card';
import { STATUS_CODE, ERROR_MESSAGE } from './utils/constants/errors';

declare global {
  namespace Express {
    interface Request {
      user: { _id: string };
    }
  }
}

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Временное решение авторизации пользователя
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { _id: '652be5362b8a4111f253f4d0' };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

// Обработчик ошибки 404
app.use((req: Request, res: Response) => {
  res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.NotFoundRoute });
});

app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
