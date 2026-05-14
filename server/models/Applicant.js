import mongoose from 'mongoose';

const applicantSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true, index: true },
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: { type: String, required: true, lowercase: true, trim: true },
    phone: { type: String, default: '' },
    resumeUrl: { type: String, required: true },
    coverLetter: { type: String, default: '' },
    experience: { type: Number, min: 0, max: 50 },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'rejected', 'hired'],
      default: 'pending'
    },
    notes: { type: String, default: '' },
    appliedAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

applicantSchema.index({ name: 'text', email: 'text' });

export default mongoose.model('Applicant', applicantSchema);
