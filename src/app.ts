import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/user';
import cardsRouter from './routes/card';
import { Request, Response, NextFunction } from 'express';

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

//Временное решение авторизации пользователя
app.use((req: Request, res: Response, next: NextFunction) => {
  req.user = { _id: '652be5362b8a4111f253f4d0' };
  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})