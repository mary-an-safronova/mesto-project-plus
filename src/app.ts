import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/user';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());

app.use('/users', usersRouter);

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})