import express from 'express';
import {
  createApplicant,
  deleteApplicant,
  getApplicant,
  listApplicants,
  listApplicantsByJob,
  updateApplicantNotes,
  updateApplicantStatus
} from '../controllers/applicantController.js';
import { protect } from '../middleware/authMiddleware.js';
import validate from '../middleware/validate.js';
import { applicantStatusValidator, applicantValidator, notesValidator } from '../validators/applicantValidators.js';

const router = express.Router();

router.get('/', protect, listApplicants);
router.get('/job/:jobId', protect, listApplicantsByJob);
router.post('/job/:jobId', applicantValidator, validate, createApplicant);
router.get('/:id', protect, getApplicant);
router.patch('/:id/status', protect, applicantStatusValidator, validate, updateApplicantStatus);
router.put('/:id/notes', protect, notesValidator, validate, updateApplicantNotes);
router.delete('/:id', protect, deleteApplicant);

export default router;
