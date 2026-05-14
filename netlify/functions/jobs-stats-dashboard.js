import connectDB from '../utils/db.js';
import { protect } from '../utils/auth.js';
import Job from '../../server/models/Job.js';
import Applicant from '../../server/models/Applicant.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    await connectDB();

    const user = await protect(event);

    const jobs = await Job.find({ recruiter: user._id }).sort({ createdAt: -1 });
    const applicants = await Applicant.find({ recruiter: user._id }).populate('job', 'title').sort({ appliedAt: -1 });
    const byStatus = applicants.reduce((acc, a) => ({ ...acc, [a.status]: (acc[a.status] || 0) + 1 }), {});

    return {
      statusCode: 200,
      body: JSON.stringify({
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
      }),
    };
  } catch (error) {
    console.error('Dashboard stats error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};