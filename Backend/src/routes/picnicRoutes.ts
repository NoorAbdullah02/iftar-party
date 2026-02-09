import { Router } from 'express';
import {
    registerForPicnic,
    getRegistrations,
    getRegistrationDetails,
    markPaymentStatus,
    markMultiplePaymentStatus,
    addExpense,
    getExpenses,
    removeExpense,
    getFinancials,
    modifyRegistration,
    removeRegistration,
    searchRegistrationsByTransactionId
} from '../controllers/picnicController';
import { verifyToken } from '../middleware/authMiddleware';

const router = Router();

// ==================== PUBLIC ROUTES ====================
router.post('/register', registerForPicnic);

// ==================== PROTECTED ADMIN ROUTES ====================
// Registrations
router.get('/registrations', verifyToken, getRegistrations);
router.get('/registrations/search', verifyToken, searchRegistrationsByTransactionId);
router.get('/registrations/:id', verifyToken, getRegistrationDetails);
router.patch('/registrations/:id/payment', verifyToken, markPaymentStatus);
router.put('/registrations/:id', verifyToken, modifyRegistration);
router.patch('/registrations/payment/bulk', verifyToken, markMultiplePaymentStatus);
router.delete('/registrations/:id', verifyToken, removeRegistration);

// Expenses
router.post('/expenses', verifyToken, addExpense);
router.get('/expenses', verifyToken, getExpenses);
router.delete('/expenses/:id', verifyToken, removeExpense);

// Financials
router.get('/financials', verifyToken, getFinancials);

export default router;

