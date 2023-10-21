import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { errors } from 'celebrate';
import { cardsRouter, usersRouter } from './routes';
import { STATUS_CODE, ERROR_MESSAGE } from './utils/constants/errors';
import { createUserController, loginController } from './controllers/user';
import auth from './middlewares/auth';
import centralizedError from './middlewares/centralized-error';
import { requestLogger, errorLogger } from './middlewares/logger';
import { validateCreateUser, validateLogin, validationErrorHandler } from './middlewares/validation';

// Подключение и загрузка переменных окружения из файла .env
require('dotenv').config();

// Установка middleware cookie-parser,
// который позволяет анализировать и обрабатывать cookie в запросах
const cookieParser = require('cookie-parser');

// Объявление пространства имен для расширения объекта Request из пакета express,
// чтобы добавить свойство user в объект запроса
declare global {
  namespace Express {
    interface Request {
      user: { _id: string };
    }
  }
}

const { PORT = 3000 } = process.env;

const app = express();

// Подключение к базе данных MongoDB с использованием пакета mongoose
mongoose.connect('mongodb://localhost:27017/mestodb');

// Middleware для обработки тела запроса в форматах JSON и URL-кодированном виде
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cookieParser()); // Подключаем парсер кук как мидлвар

app.use(requestLogger); // Подключаем логер запросов

// Маршруты для обработки запросов на аутентификацию и создание пользователей
app.post('/signin', validateLogin, loginController);
app.post('/signup', validateCreateUser, createUserController);

//  middleware, для обработки и проверки авторизации пользователя
app.use(auth);

// Маршруты для обработки запросов, требующих авторизацию
app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use(errorLogger); // Подключаем логер ошибок

// Middleware для обработки ошибок валидации celebrate
app.use(errors());
app.use(validationErrorHandler);

// Middleware для централизованной обработки ошибок
app.use(centralizedError);

// Обработчик ошибки 404,
// который будет вызван, если ни один из предыдущих маршрутов не соответствует запросу
app.use((req: Request, res: Response) => {
  res.status(STATUS_CODE.NotFound).send({ message: ERROR_MESSAGE.NotFoundRoute });
});

// Запуск сервера на указанном порту
app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
