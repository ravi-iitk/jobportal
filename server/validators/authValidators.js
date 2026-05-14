import { body } from 'express-validator';

export const signupValidator = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').matches(/\d/).withMessage('Password must contain a number'),
  body('company').trim().isLength({ min: 2, max: 80 }).withMessage('Company must be 2-80 characters')
];

export const requestSignupOtpValidator = [
  body('name').trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').matches(/\d/).withMessage('Password must contain a number'),
  body('company').trim().isLength({ min: 2, max: 80 }).withMessage('Company must be 2-80 characters')
];

export const verifySignupOtpValidator = [
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).withMessage('OTP must be 6 digits')
];

export const loginValidator = [
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('password').notEmpty().withMessage('Password is required')
];

export const updateProfileValidator = [
  body('name').optional().trim().isLength({ min: 2, max: 50 }).withMessage('Name must be 2-50 characters'),
  body('company').optional().trim().isLength({ min: 2, max: 80 }).withMessage('Company must be 2-80 characters'),
  body('avatar').optional().isURL().withMessage('Avatar must be a valid URL'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters').matches(/\d/).withMessage('Password must contain a number')
];
