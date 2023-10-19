export const STATUS_CODE = {
  OK: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
  Unauthorized: 401,
};

export const ERROR_MESSAGE = {
  UserNotFound: 'Пользователь не найден или был запрошен несуществующий маршрут',
  CardNotFound: 'Карточка не найдена или был запрошен несуществующий маршрут',
  IncorrectId: 'Переданы некорректные данные',
  Error: 'Внутренняя ошибка сервера',
  NotFoundRoute: 'Запрошен несуществующий маршрут',
  IncorrectEmailOrPassword: 'Неправильные почта или пароль',
  AuthenticationError: 'Ошибка аутентификации',
};

export const MESSAGE = {
  CardIsDelete: 'Карточка успешно удалена',
  Correct: 'Успешная аутентификация',
  NeedAutorization: 'Необходима авторизация',
};
