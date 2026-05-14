import { body } from 'express-validator';

const statuses = ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'];

export const applicantValidator = [
  body('name').trim().isLength({ min: 2, max: 80 }).withMessage('Name must be 2-80 characters'),
  body('email').isEmail().withMessage('Must be a valid email').normalizeEmail(),
  body('resumeUrl').isURL().withMessage('Resume URL must be valid'),
  body('experience').optional({ nullable: true }).isFloat({ min: 0, max: 50 }).withMessage('Experience must be 0-50')
];

export const applicantStatusValidator = [body('status').isIn(statuses).withMessage('Invalid applicant status')];

export const notesValidator = [body('notes').optional().isString().withMessage('Notes must be text')];
