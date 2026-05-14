import Job from '../models/Job.js';
import Applicant from '../models/Applicant.js';

const buildJobFilter = (query, recruiterId) => {
  const filter = { recruiter: recruiterId };
  if (query.search) filter.$or = [{ title: new RegExp(query.search, 'i') }, { location: new RegExp(query.search, 'i') }];
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
  return filter;
};

export const listJobs = async (req, res) => {
  const page = Number(req.query.page || 1);
  const limit = Number(req.query.limit || 10);
  const sortBy = req.query.sortBy || 'createdAt';
  const order = req.query.order === 'asc' ? 1 : -1;
  const filter = buildJobFilter(req.query, req.user._id);

  const total = await Job.countDocuments(filter);
  const data = await Job.find(filter)
    .sort({ [sortBy]: order })
    .skip((page - 1) * limit)
    .limit(limit);

  res.json({ success: true, data, pagination: { total, page, pages: Math.ceil(total / limit), limit } });
};

export const createJob = async (req, res) => {
  const job = await Job.create({ ...req.body, recruiter: req.user._id, company: req.user.company });
  res.status(201).json({ success: true, data: job });
};

export const getJob = async (req, res) => {
  const job = await Job.findOne({ _id: req.params.id, recruiter: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, data: job });
};

export const updateJob = async (req, res) => {
  const job = await Job.findOneAndUpdate({ _id: req.params.id, recruiter: req.user._id }, req.body, { new: true, runValidators: true });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, data: job });
};

export const deleteJob = async (req, res) => {
  const job = await Job.findOneAndDelete({ _id: req.params.id, recruiter: req.user._id });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  await Applicant.deleteMany({ job: job._id, recruiter: req.user._id });
  res.json({ success: true, message: 'Job and related applicants deleted' });
};

export const updateJobStatus = async (req, res) => {
  const job = await Job.findOneAndUpdate({ _id: req.params.id, recruiter: req.user._id }, { status: req.body.status }, { new: true });
  if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
  res.json({ success: true, data: job });
};

export const dashboardStats = async (req, res) => {
  const jobs = await Job.find({ recruiter: req.user._id }).sort({ createdAt: -1 });
  const applicants = await Applicant.find({ recruiter: req.user._id }).populate('job', 'title').sort({ appliedAt: -1 });
  const byStatus = applicants.reduce((acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }), {});
  res.json({
    success: true,
    data: {
      totalJobs: jobs.length,
      activeJobs: jobs.filter((j) => j.status === 'active').length,
      totalApplicants: applicants.length,
      shortlisted: byStatus.shortlisted || 0,
      recentJobs: jobs.slice(0, 5),
      recentApplicants: applicants.slice(0, 5),
      applicantsByStatus: byStatus
    }
  });
};
