import connectDB from '../utils/db.js';
import { protect } from '../utils/auth.js';
import Job from '../../server/models/Job.js';
import Applicant from '../../server/models/Applicant.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'DELETE') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    await connectDB();

    const user = await protect(event);
    const id = event.path.split('/').pop();

    const job = await Job.findOneAndDelete({ _id: id, recruiter: user._id });
    if (!job) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Job not found' }),
      };
    }

    await Applicant.deleteMany({ job: job._id, recruiter: user._id });
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Job and related applicants deleted' }),
    };
  } catch (error) {
    console.error('Delete job error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};