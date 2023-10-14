import { Schema, model } from "mongoose";

interface IUser {
  name: string;
  about: string;
  avatar: string;
}

// Создание схемы юзера
const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 200,
  },
  avatar: {
    type: String,
    required: true,
  }
});

// Создание и экспорт модели юзера
export default model<IUser>('user', userSchema);