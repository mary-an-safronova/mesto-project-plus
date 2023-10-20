import winston from 'winston';
import expressWinston from 'express-winston';
import 'winston-daily-rotate-file';

const transport = (fileName: string, date: string) => new winston.transports.DailyRotateFile({
  filename: fileName, // Формат имени файла
  datePattern: date, // Шаблон для даты
  maxFiles: '7d', // Максимальное время хранения файлов
});

const requestFileTransport = transport('./logs/request-%DATE%.log', 'YYYY-MM-DD-HH');
const errorFileTransport = transport('./logs/error-%DATE%.log', 'YYYY-MM-DD-HH');

// Логер запросов
const requestLogger = expressWinston.logger({
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Вывод логов в консоль
    requestFileTransport, // Запись логов в файл request.log
  ],
  format: winston.format.json(), // Формат записи логов
});

// Логер ошибок
const errorLogger = expressWinston.errorLogger({
  transports: [
    new winston.transports.Console({ format: winston.format.simple() }), // Вывод логов в консоль
    errorFileTransport, // Запись логов в файл error.log
  ],
  format: winston.format.json(), // Формат записи логов
});

export { requestLogger, errorLogger };
