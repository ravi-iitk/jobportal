import Applicant from '../models/Applicant.js';
import Job from '../models/Job.js';

const buildFilter = (query, recruiterId) => {
  const filter = { recruiter: recruiterId };
  if (query.status) filter.status = query.status;
  if (query.search) filter.$or = [{ name: new RegExp(query.search, 'i') }, { email: new RegExp(query.search, 'i') }];
  if (query.job) filter.job = query.job;
  return filter;
};

export const listApplicants = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 15);
  const filter = buildFilter(req.query, req.user._id);
  const total = await Applicant.countDocuments(filter);
  const data = await Applicant.find(filter).populate('job', 'title').sort({ appliedAt: -1 }).skip((page - 1) * limit).limit(limit);
  res.json({ success: true, data, pagination: { total, page, pages: Math.ceil(total / limit), limit } });
};

export const listApplicantsByJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, recruiter: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  const data = await Applicant.find({ job: job._id, recruiter: req.user._id }).populate('job', 'title');
  res.json({ success: true, data });
};

export const getApplicant = async (req, res) => {
  const applicant = await Applicant.findOne({ _id: req.params.id, recruiter: req.user._id }).populate('job', 'title location type');
  if (!applicant) return res.status(404).json({ success: false, message: 'Applicant not found' });
  res.json({ success: true, data: applicant });
};

export const createApplicant = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.jobId, status: 'active' });
  if (!job) return res.status(404).json({ success: false, message: 'Active job not found' });
  const applicant = await Applicant.create({ ...req.body, job: job._id, recruiter: job.recruiter });
  await Job.findByIdAndUpdate(job._id, { $inc: { applicantCount: 1 } });
  res.status(201).json({ success: true, data: applicant });
};

export const updateApplicantStatus = async (req, res) => {
  const applicant = await Applicant.findOneAndUpdate({ _id: req.params.id, recruiter: req.user._id }, { status: req.body.status }, { new: true });
  if (!applicant) return res.status(404).json({ success: false, message: 'Applicant not found' });
  res.json({ success: true, data: applicant });
};

export const updateApplicantNotes = async (req, res) => {
  const applicant = await Applicant.findOneAndUpdate({ _id: req.params.id, recruiter: req.user._id }, { notes: req.body.notes || '' }, { new: true });
  if (!applicant) return res.status(404).json({ success: false, message: 'Applicant not found' });
  res.json({ success: true, data: applicant });
};

export const deleteApplicant = async (req, res) => {
  const applicant = await Applicant.findOneAndDelete({ _id: req.params.id, recruiter: req.user._id });
  if (!applicant) return res.status(404).json({ success: false, message: 'Applicant not found' });
  await Job.findByIdAndUpdate(applicant.job, { $inc: { applicantCount: -1 } });
  res.json({ success: true, message: 'Applicant deleted' });
};
