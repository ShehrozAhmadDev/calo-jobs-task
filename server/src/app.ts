import express, { Express } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import httpStatus from 'http-status';
import { morgan } from './config/logger';
import { ApiError, errorConverter, errorHandler } from './config/errors';
import routes from './routes/v1';

const app: Express = express();

app.use(morgan.successHandler);
app.use(morgan.errorHandler);

app.use(helmet());

const corsOptions = {
  origin: 'http://localhost:3000',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
};
app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((_req, _res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, 'Not found'));
});

app.use(errorConverter);

app.use(errorHandler);

export default app;
