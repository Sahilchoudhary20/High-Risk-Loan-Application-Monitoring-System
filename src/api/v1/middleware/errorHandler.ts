import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export const errorHandler = (err: any, _req: Request, res: Response, _next: NextFunction) => {

  if (err instanceof AppError) {
    const payload = {
      error: {
        message: err.message,
        code: err.statusCode,
        details: err.details || null,
        timestamp: new Date().toISOString()
      }
    };

    return res.status(err.statusCode).json(payload);
  }


  console.error('Unhandled error:', err);
  return res.status(500).json({
    error: {
      message: 'Internal Server Error',
      code: 500,
      timestamp: new Date().toISOString()
    }
  });
};
