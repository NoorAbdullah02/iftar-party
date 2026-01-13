import { Router } from "express";
import { registerUser, loginUser, checkEmailExists, getCurrentUser, logoutUser, userProfile, verify_email, send_verification_email, verifyEmailToken, resendVerificationByEmail } from '../controllers/userController'
import { checkValiditi } from '../middleware/checkValidUser'

const router = Router();

router.post('/register', registerUser);

router.post('/check-email', checkEmailExists)

router.post('/login', loginUser);

router.post('/logout', logoutUser);


router.get('/profile', checkValiditi, userProfile);

router.get('/verify-email', checkValiditi, verify_email);

router.post('/send-verification-email', checkValiditi, send_verification_email);

router.post('/resend-verification-email', resendVerificationByEmail);

router.post('/verify-email-token', verifyEmailToken);

// Returns current user if authenticated (reads httpOnly cookie or Authorization header)
router.get('/me', checkValiditi, getCurrentUser);



export default router; 