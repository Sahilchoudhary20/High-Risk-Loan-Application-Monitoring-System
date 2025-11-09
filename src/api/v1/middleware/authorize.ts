import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './auth';
import { AppError } from '../errors/AppError';


export const authorize = (allowedRoles: string[] = []) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    const user = req.user;
    if (!user) return next(new AppError('Unauthorized', 401));
    const role = (user as any).role || ((user as any).claims && (user as any).claims.role);

    if (!role && allowedRoles.length > 0) {
      return next(new AppError('Forbidden: no role assigned', 403));
    }
    if (allowedRoles.length && !allowedRoles.includes(role)) {
      return next(new AppError('Forbidden: insufficient role', 403));
    }
    return next();
  };
};
