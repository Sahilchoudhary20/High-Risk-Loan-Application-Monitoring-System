import { Router } from 'express';
import * as controller from '../controllers/claimsController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();


router.post('/set', authenticate, authorize(['admin']), controller.setCustomClaims);


router.get('/user/:uid', authenticate, controller.getUser);

export default router;
