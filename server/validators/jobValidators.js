import { body, query } from 'express-validator';

const jobTypes = ['Full-Time', 'Part-Time', 'Contract', 'Internship'];
const categories = ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Other'];
const statuses = ['active', 'closed', 'draft'];

export const jobValidator = [
  body('title').trim().isLength({ min: 3, max: 100 }).withMessage('Title must be 3-100 characters'),
  body('location').trim().notEmpty().withMessage('Location is required'),
  body('type').isIn(jobTypes).withMessage('Invalid job type'),
  body('category').isIn(categories).withMessage('Invalid category'),
  body('description').isLength({ min: 50 }).withMessage('Description must be at least 50 characters'),
  body('requirements').optional().isArray().withMessage('Requirements must be an array'),
  body('salaryMin').optional({ nullable: true }).isFloat({ min: 0 }).withMessage('salaryMin must be positive'),
  body('salaryMax').optional({ nullable: true }).custom((value, { req }) => {
    if (value && req.body.salaryMin && Number(value) < Number(req.body.salaryMin)) throw new Error('salaryMax must be >= salaryMin');
    return true;
  }),
  body('currency').optional().isIn(['INR', 'USD', 'EUR', 'GBP', 'AED']).withMessage('Invalid currency'),
  body('deadline').optional({ checkFalsy: true }).isISO8601().withMessage('Deadline must be a valid date'),
  body('status').optional().isIn(statuses).withMessage('Invalid status')
];

export const statusValidator = [body('status').isIn(statuses).withMessage('Invalid status')];

export const listJobsValidator = [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 })
];
