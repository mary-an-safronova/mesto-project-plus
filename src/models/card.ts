import { Schema, model, Types } from "mongoose";

interface ICard {
  name: string;
  link: string;
  owner: Types.ObjectId;
  likes: Types.ObjectId[];
  createdAt: Date;
}

// Схема карточки
const cardSchema = new Schema<ICard>({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'user',
    required: true
  },
  likes: {
    type: [Schema.Types.ObjectId],
    default: [],
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

// Модель карточки
export default model<ICard>('card', cardSchema);