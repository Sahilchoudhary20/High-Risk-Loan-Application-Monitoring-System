import { Request, Response, NextFunction } from 'express';
import admin from '../../../config/firebase';
import { AppError } from '../errors/AppError';

export const setCustomClaims = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid, role } = req.body;
    if (!uid || !role) return next(new AppError('uid and role are required', 400));
    await admin.auth().setCustomUserClaims(uid, { role });
    return res.json({ message: 'custom claims set', uid, role });
  } catch (err: any) {
    return next(new AppError(err.message || 'Failed to set claims', 500));
  }
};

export const getUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { uid } = req.params;
    const userRecord = await admin.auth().getUser(uid);
    return res.json({ user: userRecord });
  } catch (err: any) {
    return next(new AppError(err.message || 'Failed to get user', 500));
  }
};
