import express from 'express';
import { createJob, dashboardStats, deleteJob, getJob, listJobs, updateJob, updateJobStatus } from '../controllers/jobController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { jobValidator, listJobsValidator, statusValidator } from '../validators/jobValidators.js';

const router = express.Router();

router.get('/stats/dashboard', protect, dashboardStats);
router.route('/').get(protect, listJobsValidator, validate, listJobs).post(protect, jobValidator, validate, createJob);
router.route('/:id').get(protect, getJob).put(protect, jobValidator, validate, updateJob).delete(protect, deleteJob);
router.patch('/:id/status', protect, statusValidator, validate, updateJobStatus);

export default router;
