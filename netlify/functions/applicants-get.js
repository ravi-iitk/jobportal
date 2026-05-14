import connectDB from '../utils/db.js';
import { protect } from '../utils/auth.js';
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
    const id = event.path.split('/').pop();

    const applicant = await Applicant.findOne({ _id: id, recruiter: user._id }).populate('job', 'title location type');
    if (!applicant) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Applicant not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: applicant }),
    };
  } catch (error) {
    console.error('Get applicant error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};