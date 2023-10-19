import {
  Schema, model, Model, Document,
} from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import { ERROR_MESSAGE } from '../utils/constants/errors';

export interface IUser {
  name: string;
  about: string;
  avatar: string;
  email: string;
  password: string;
}

interface UserModel extends Model<IUser> {
  findUserByCredentials: (email: string, password: string) =>
  Promise<Document<unknown, any, IUser>>
}

// Схема пользователя
const userSchema = new Schema<IUser, UserModel>({
  name: {
    type: String,
    minlength: 2,
    maxlength: 30,
    default: 'Жак-Ив Кусто',
  },
  about: {
    type: String,
    minlength: 2,
    maxlength: 200,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value: string) => validator.isEmail(value),
      message: 'Недействительный адрес электронной почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
}, { versionKey: false }); // Исключаем поле "__v"

// Проверка почты и пароля
userSchema.static('findUserByCredentials', function findUserByCredentials(email: string, password: string) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error(ERROR_MESSAGE.IncorrectEmailOrPassword));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error(ERROR_MESSAGE.IncorrectEmailOrPassword));
          }

          return user;
        });
    });
});

// Модель пользователя
export default model<IUser, UserModel>('user', userSchema);
