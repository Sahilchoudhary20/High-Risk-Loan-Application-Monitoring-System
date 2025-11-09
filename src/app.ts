import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import loansRouter from './api/v1/routes/loans';
import claimsRouter from './api/v1/routes/claims';
import { errorHandler } from './api/v1/middleware/errorHandler';
import { requestLogger } from './api/v1/middleware/logger';

const app = express();

app.use(helmet());
app.use(cors());
app.use(bodyParser.json());
app.use(requestLogger);        // custom winston logger middleware
app.use(morgan('dev'));       // morgan for concise HTTP logs in dev

app.get('/health', (_req, res) => res.json({ status: 'ok', timestamp: new Date().toISOString() }));

app.use('/api/v1/loans', loansRouter);
app.use('/api/v1/claims', claimsRouter);

// 404
app.use((_req, _res, next) => {
  const err: any = new Error('Not Found');
  err.status = 404;
  next(err);
});

// Global error handler
app.use(errorHandler);

export default app;
