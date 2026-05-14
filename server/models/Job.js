import mongoose from 'mongoose';

const jobSchema = new mongoose.Schema(
  {
    recruiter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true, minlength: 3, maxlength: 100 },
    company: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    type: { type: String, enum: ['Full-Time', 'Part-Time', 'Contract', 'Internship'], required: true },
    category: { type: String, enum: ['Engineering', 'Design', 'Marketing', 'Sales', 'HR', 'Other'], required: true },
    description: { type: String, required: true, minlength: 50 },
    requirements: [{ type: String, trim: true }],
    salaryMin: { type: Number, min: 0 },
    salaryMax: { type: Number, min: 0 },
    currency: { type: String, default: 'INR' },
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active' },
    deadline: Date,
    applicantCount: { type: Number, default: 0 }
  },
  { timestamps: true }
);

jobSchema.index({ title: 'text', company: 'text', location: 'text' });

export default mongoose.model('Job', jobSchema);
