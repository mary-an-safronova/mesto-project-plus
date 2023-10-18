export const STATUS_CODE = {
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
};

export const ERROR_MESSAGE = {
  UserNotFound: 'Пользователь не найден или был запрошен несуществующий маршрут',
  CardNotFound: 'Карточка не найдена или был запрошен несуществующий маршрут',
  CardIsDelete: 'Карточка успешно удалена',
  IncorrectId: 'Переданы некорректные данные',
  Error: 'На сервере произошла ошибка',
  NotFoundRoute: 'Запрошен несуществующий маршрут',
};
