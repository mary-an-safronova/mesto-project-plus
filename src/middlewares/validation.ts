import { celebrate, Joi, Segments } from 'celebrate';
import { NextFunction, Request, Response } from 'express';
import { STATUS_CODE } from '../utils/constants/errors';
import urlRegex from '../utils/constants/validate';

// Middleware для валидации данных при создании нового пользователя
export const validateCreateUser = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .empty('')
      .default('Жак-Ив Кусто')
      .messages({
        'string.min': 'Поле name должно содержать не менее {#limit} символов',
        'string.max': 'Поле name должно содержать не более {#limit} символов',
      }),
    about: Joi.string().min(2).max(200)
      .empty('')
      .default('Исследователь')
      .messages({
        'string.min': 'Поле about должно содержать не менее {#limit} символов',
        'string.max': 'Поле about должно содержать не более {#limit} символов',
      }),
    avatar: Joi.string()
      .empty('')
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png')
      .pattern(urlRegex)
      .messages({
        'string.pattern.base': 'URL поля avatar не соответствовует регулярному выражению',
      }),
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Недействительный адрес электронной почты',
        'any.required': 'Email обязательное поле',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Пароль обязательное поле',
      }),
  }).unknown(true),
});

// Middleware для валидации данных при обновлении информации о пользователе
export const validateUpdateUserInfo = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30)
      .messages({
        'string.min': 'Поле name должно содержать не менее {#limit} символов',
        'string.max': 'Поле name должно содержать не более {#limit} символов',
      }),
    about: Joi.string().min(2).max(200)
      .messages({
        'string.min': 'Поле about должно содержать не менее {#limit} символов',
        'string.max': 'Поле about должно содержать не более {#limit} символов',
      }),
  }).unknown(true),
});

// Middleware для валидации данных при обновлении аватара пользователя
export const validateUpdateUserAvatar = celebrate({
  [Segments.BODY]: Joi.object().keys({
    avatar: Joi.string().required().pattern(urlRegex)
      .messages({
        'string.pattern.base': 'URL поля avatar не соответствовует регулярному выражению',
      }),
  }).unknown(true),
});

// Middleware для валидации данных при аутентификации пользователя
export const validateLogin = celebrate({
  [Segments.BODY]: Joi.object().keys({
    email: Joi.string().email().required()
      .messages({
        'string.email': 'Недействительный адрес электронной почты',
        'any.required': 'Email обязательное поле',
      }),
    password: Joi.string().required()
      .messages({
        'any.required': 'Пароль обязательное поле',
      }),
  }).unknown(true),
});

// Middleware для валидации id при получении данных текущего пользователя
export const validateGetUser = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24)
      .messages({
        'string.alphanum': 'Недопустимый формат идентификатора пользователя',
        'string.length': 'Недопустимая длина идентификатора пользователя',
        'any.required': 'Идентификатор пользователя обязательное поле',
      }),
  }).unknown(true),
});

// Middleware для валидации данных при создании новой карточки
export const validateCreateCard = celebrate({
  [Segments.BODY]: Joi.object().keys({
    name: Joi.string().min(2).max(30).required()
      .messages({
        'string.min': 'Поле name должно содержать не менее {#limit} символов',
        'string.max': 'Поле name должно содержать не более {#limit} символов',
        'any.required': 'Поле name обязательное поле',
      }),
    link: Joi.string().required().pattern(urlRegex)
      .messages({
        'string.pattern.base': 'URL поля link не соответствовует регулярному выражению',
        'any.required': 'Поле link обязательное поле',
      }),
  }).unknown(true),
});

// Middleware для валидации данных при удалении новой карточки
export const validateDeleteCard = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24)
      .messages({
        'string.alphanum': 'Недопустимый формат идентификатора карточки',
        'string.length': 'Недопустимая длина идентификатора карточки',
        'any.required': 'Идентификатор карточки обязательное поле',
      }),
  }).unknown(true),
});

// Middleware для валидации данных при лайке карточки
export const validateLikeCard = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24)
      .messages({
        'string.alphanum': 'Недопустимый формат идентификатора карточки',
        'string.length': 'Недопустимая длина идентификатора карточки',
        'any.required': 'Идентификатор карточки обязательное поле',
      }),
  }).unknown(true),
});

// Middleware для валидации данных при лайке карточки
export const validateDislikeCard = celebrate({
  [Segments.PARAMS]: Joi.object().keys({
    cardId: Joi.string().required().alphanum().length(24)
      .messages({
        'string.alphanum': 'Недопустимый формат идентификатора карточки',
        'string.length': 'Недопустимая длина идентификатора карточки',
        'any.required': 'Идентификатор карточки обязательное поле',
      }),
  }).unknown(true),
});

// Обработчик ошибок валидации
export const validationErrorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (err.joi) {
    const errorMessage = err.details.map((detail: any) => detail.message).join(', ');
    return res.status(STATUS_CODE.BadRequest).send({ message: errorMessage });
  }
  return next(err);
};
