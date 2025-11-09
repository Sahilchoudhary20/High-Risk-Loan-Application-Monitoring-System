import { Router } from 'express';
import * as controller from '../controllers/loansController';
import { authenticate } from '../middleware/auth';
import { authorize } from '../middleware/authorize';

const router = Router();

// Create loan - allow officer and manager
router.post('/', authenticate, authorize(['officer', 'manager']), controller.createLoan);

// Get all loans - allowed to any authenticated user
router.get('/', authenticate, controller.getAllLoans);

// Get loan by id - allowed to authenticated user
router.get('/:id', authenticate, controller.getLoanById);

// Update loan - manager role
router.put('/:id', authenticate, authorize(['manager']), controller.updateLoan);

// Delete loan - admin role
router.delete('/:id', authenticate, authorize(['admin']), controller.deleteLoan);

export default router;
