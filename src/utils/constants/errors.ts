export const ERROR_STATUS = {
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500
}

export const ERROR_MESSAGE = {
  UserNotFound: 'Пользователь не найден или был запрошен несуществующий роут',
  CardNotFound: 'Карточка не найдена или был запрошен несуществующий роут',
  CardIsDelete: 'Карточка успешно удалена',
  IncorrectId: 'Переданы некорректные данные',
  Error: 'На сервере произошла ошибка'
}
