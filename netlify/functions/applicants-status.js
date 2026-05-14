import connectDB from '../utils/db.js';
import { protect } from '../utils/auth.js';
import Applicant from '../../server/models/Applicant.js';

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

    const applicant = await Applicant.findOneAndUpdate({ _id: id, recruiter: user._id }, { status: body.status }, { new: true });
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
    console.error('Update applicant status error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};