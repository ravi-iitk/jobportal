import connectDB from '../utils/db.js';
import { protect } from '../utils/auth.js';
import Job from '../../server/models/Job.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    await connectDB();

    const user = await protect(event);
    const body = JSON.parse(event.body);

    const job = await Job.create({ ...body, recruiter: user._id, company: user.company });
    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, data: job }),
    };
  } catch (error) {
    console.error('Create job error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};