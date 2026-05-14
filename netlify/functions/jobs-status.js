import connectDB from '../utils/db.js';
import { protect } from '../utils/auth.js';
import Job from '../../server/models/Job.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'PATCH') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    await connectDB();

    const user = await protect(event);
    const id = event.path.split('/').pop();
    const body = JSON.parse(event.body);

    const job = await Job.findOneAndUpdate({ _id: id, recruiter: user._id }, { status: body.status }, { new: true });
    if (!job) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Job not found' }),
      };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, data: job }),
    };
  } catch (error) {
    console.error('Update job status error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};