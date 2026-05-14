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
    const jobId = event.path.split('/job/')[1];

    const job = await Job.findOne({ _id: jobId, recruiter: user._id });
    if (!job) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Job not found' }),
      };
    }

    const data = await Applicant.find({ job: job._id, recruiter: user._id }).populate('job', 'title');
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data }),
    };
  } catch (error) {
    console.error('List applicants by job error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};