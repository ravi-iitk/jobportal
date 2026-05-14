import express from 'express';
import rateLimit from 'express-rate-limit';
import { login, me, signup, updateMe, requestSignupOtp, verifySignupOtp } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { loginValidator, signupValidator, updateProfileValidator, requestSignupOtpValidator, verifySignupOtpValidator } from '../validators/authValidators.js';

const router = express.Router();
const authLimiter = rateLimit({ windowMs: 15 * 60 * 1000, limit: 10, standardHeaders: true, legacyHeaders: false });

router.post('/signup', authLimiter, signupValidator, validate, signup);
router.post('/signup/request-otp', authLimiter, requestSignupOtpValidator, validate, requestSignupOtp);
router.post('/signup/verify-otp', authLimiter, verifySignupOtpValidator, validate, verifySignupOtp);
router.post('/login', authLimiter, loginValidator, validate, login);
router.get('/me', protect, me);
router.put('/me', protect, updateProfileValidator, validate, updateMe);

export default router;
