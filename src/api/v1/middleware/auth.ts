import { Request, Response, NextFunction } from 'express';
import admin from '../../../config/firebase';
import { AuthError } from '../errors/AuthError';

export interface AuthenticatedRequest extends Request {
  user?: any;
}

export const authenticate = async (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
      return next(new AuthError('Missing Authorization header or token'));
    }
    const idToken = header.split(' ')[1];
    const decoded = await admin.auth().verifyIdToken(idToken);
    
    req.user = decoded;
    return next();
  } catch (err: any) {
    return next(new AuthError(err.message || 'Invalid or expired token'));
  }
};
