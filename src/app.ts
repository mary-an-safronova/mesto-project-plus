import express from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/user';
import cardsRouter from './routes/card';

const { PORT = 3000 } = process.env;

const app = express();

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use((req, res, next) => {
  req.body.user = { _id: '5d8b8592978f8bd833ca8133' };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter)

app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`)
})