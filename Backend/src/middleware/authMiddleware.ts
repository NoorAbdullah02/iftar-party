import { Request, Response, NextFunction } from 'express';
import { checkValiditi } from './checkValidUser';

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    // call checkValiditi to resolve user from tokens
    await checkValiditi(req, res, () => {
        // middleware completed, check if user was attached
        if (!(req as any).user) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Please login first' });
        }
        next();
    });
};
