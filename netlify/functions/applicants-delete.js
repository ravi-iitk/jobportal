import connectDB from '../utils/db.js';
import { protect } from '../utils/auth.js';
import Applicant from '../../server/models/Applicant.js';
import Job from '../../server/models/Job.js';

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

    const applicant = await Applicant.findOneAndDelete({ _id: id, recruiter: user._id });
    if (!applicant) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Applicant not found' }),
      };
    }

    await Job.findByIdAndUpdate(applicant.job, { $inc: { applicantCount: -1 } });
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, message: 'Applicant deleted' }),
    };
  } catch (error) {
    console.error('Delete applicant error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};