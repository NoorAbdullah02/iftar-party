import { Request, Response } from 'express';
import {
    createRegistration,
    getAllRegistrations,
    getRegistrationById,
    updatePaymentStatus,
    updateMultiplePaymentStatus,
    getRegistrationsByBatch,
    getPaidRegistrationsCount,
    createExpense,
    getAllExpenses,
    deleteExpense,
    getFinancialSummary,
    getTotalExpenses,
    getTotalCollectedAmount,
    getRemainingBalance,
    updateRegistration,
    deleteRegistration,
    searchByTransactionId
} from '../db/picnicQueries';

// ==================== REGISTRATION CONTROLLERS ====================

export const registerForPicnic = async (req: Request, res: Response) => {
    try {
        const { name, department, batch, mobile, email, paymentMethod, paymentMedium, transactionId } = req.body;

        if (!name || !batch || !mobile || !email) {
            return res.status(400).json({
                success: false,
                message: 'All fields are required'
            });
        }

        // Default to cash if no payment method provided (for backward compatibility)
        const finalPaymentMethod = paymentMethod || 'cash';

        // Validate payment method
        if (!['cash', 'online'].includes(finalPaymentMethod)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid payment method. Must be "cash" or "online"'
            });
        }

        // If online payment, validate payment medium and transaction ID
        if (finalPaymentMethod === 'online') {
            if (!paymentMedium || !['bkash', 'nagad'].includes(paymentMedium)) {
                return res.status(400).json({
                    success: false,
                    message: 'For online payment, payment medium must be "bkash" or "nagad"'
                });
            }

            if (!transactionId || transactionId.trim() === '') {
                return res.status(400).json({
                    success: false,
                    message: 'Transaction ID is required for online payment'
                });
            }
        }

        const registration = await createRegistration({
            name,
            department: department || 'ICE',
            batch,
            mobile,
            email,
            paymentStatus: false,
            paymentMethod: finalPaymentMethod,
            paymentMedium: finalPaymentMethod === 'online' ? paymentMedium : null,
            transactionId: finalPaymentMethod === 'online' ? transactionId : null
        });

        res.status(201).json({
            success: true,
            message: 'Registration successful',
            data: registration
        });
    } catch (error: any) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Registration failed'
        });
    }
};

export const getRegistrations = async (req: Request, res: Response) => {
    try {
        const { batch } = req.query;

        let registrations;
        if (batch && typeof batch === 'string') {
            registrations = await getRegistrationsByBatch(batch);
        } else {
            registrations = await getAllRegistrations();
        }

        res.status(200).json({
            success: true,
            data: registrations
        });
    } catch (error: any) {
        console.error('Get registrations error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch registrations'
        });
    }
};

export const getRegistrationDetails = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const registration = await getRegistrationById(Number(id));

        if (!registration) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.status(200).json({
            success: true,
            data: registration
        });
    } catch (error: any) {
        console.error('Get registration details error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch registration details'
        });
    }
};

export const markPaymentStatus = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Status must be a boolean value'
            });
        }

        const updated = await updatePaymentStatus(Number(id), status);

        res.status(200).json({
            success: true,
            message: 'Payment status updated',
            data: updated
        });
    } catch (error: any) {
        console.error('Update payment status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update payment status'
        });
    }
};

export const markMultiplePaymentStatus = async (req: Request, res: Response) => {
    try {
        const { ids, status } = req.body;

        if (!Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'IDs must be a non-empty array'
            });
        }

        if (typeof status !== 'boolean') {
            return res.status(400).json({
                success: false,
                message: 'Status must be a boolean value'
            });
        }

        const updated = await updateMultiplePaymentStatus(ids, status);

        res.status(200).json({
            success: true,
            message: `Payment status updated for ${updated.length} registrations`,
            data: updated
        });
    } catch (error: any) {
        console.error('Update multiple payment status error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update payment status'
        });
    }
};

// ==================== EXPENSE CONTROLLERS ====================

export const addExpense = async (req: Request, res: Response) => {
    try {
        const { title, amount, note } = req.body;

        if (!title || !amount) {
            return res.status(400).json({
                success: false,
                message: 'Title and amount are required'
            });
        }

        if (typeof amount !== 'number' || amount <= 0) {
            return res.status(400).json({
                success: false,
                message: 'Amount must be a positive number'
            });
        }

        const expense = await createExpense({
            title,
            amount,
            note: note || null
        });

        res.status(201).json({
            success: true,
            message: 'Expense added successfully',
            data: expense
        });
    } catch (error: any) {
        console.error('Add expense error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add expense'
        });
    }
};

export const getExpenses = async (req: Request, res: Response) => {
    try {
        const expenses = await getAllExpenses();

        res.status(200).json({
            success: true,
            data: expenses
        });
    } catch (error: any) {
        console.error('Get expenses error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch expenses'
        });
    }
};

export const removeExpense = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await deleteExpense(Number(id));

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Expense not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Expense deleted successfully',
            data: deleted
        });
    } catch (error: any) {
        console.error('Delete expense error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete expense'
        });
    }
};

// ==================== FINANCIAL CONTROLLERS ====================

export const getFinancials = async (req: Request, res: Response) => {
    try {
        const summary = await getFinancialSummary();

        res.status(200).json({
            success: true,
            data: summary
        });
    } catch (error: any) {
        console.error('Get financials error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to fetch financial data'
        });
    }
};

// ==================== EDIT/DELETE REGISTRATION ====================

export const modifyRegistration = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const updates = req.body;

        if (!updates || Object.keys(updates).length === 0) {
            return res.status(400).json({
                success: false,
                message: 'No update data provided'
            });
        }

        const updated = await updateRegistration(Number(id), updates);

        if (!updated) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Registration updated successfully',
            data: updated
        });
    } catch (error: any) {
        console.error('Update registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to update registration'
        });
    }
};

export const removeRegistration = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;

        const deleted = await deleteRegistration(Number(id));

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'Registration not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'Registration deleted successfully',
            data: deleted
        });
    } catch (error: any) {
        console.error('Delete registration error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to delete registration'
        });
    }
};

// ==================== SEARCH CONTROLLER ====================

export const searchRegistrationsByTransactionId = async (req: Request, res: Response) => {
    try {
        const { transactionId } = req.query;

        if (!transactionId || typeof transactionId !== 'string') {
            return res.status(400).json({
                success: false,
                message: 'Transaction ID is required'
            });
        }

        const registrations = await searchByTransactionId(transactionId);

        res.status(200).json({
            success: true,
            data: registrations,
            count: registrations.length
        });
    } catch (error: any) {
        console.error('Search by transaction ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to search registrations'
        });
    }
};

