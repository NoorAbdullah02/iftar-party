import { Router } from "express";
import { registerUser, loginUser, checkEmailExists, getCurrentUser, logoutUser } from '../controllers/userController'
import { checkValiditi } from '../middleware/checkValidUser'

const router = Router();

router.post('/register', registerUser);

router.post('/check-email', checkEmailExists)

router.post('/login', loginUser);

router.post('/logout', logoutUser);

// Returns current user if authenticated (reads httpOnly cookie or Authorization header)
router.get('/me', checkValiditi, getCurrentUser);



export default router; 