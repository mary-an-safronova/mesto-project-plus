export const STATUS_CODE = {
  OK: 200,
  Created: 201,
  BadRequest: 400,
  NotFound: 404,
  InternalServerError: 500,
  Unauthorized: 401,
  Forbidden: 403,
  Conflict: 409,
};

export const ERROR_MESSAGE = {
  NotFound: 'Resource not found',
  IncorrectData: 'Incorrect data',
  Error: 'Internal server error',
  NotFoundRoute: 'Not found route',
  IncorrectEmailOrPassword: 'Incorrect email or password',
  AuthenticationError: 'Invalid token',
  AnotherUserCard: 'Cannot delete another user card',
  MailAlreadyExists: 'User already registered',
};

export const MESSAGE = {
  CardIsDelete: 'Card is delete',
  NeedAutorization: 'Need autorization',
};
