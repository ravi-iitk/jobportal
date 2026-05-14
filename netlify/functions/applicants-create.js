import connectDB from '../utils/db.js';
import Job from '../../server/models/Job.js';
import Applicant from '../../server/models/Applicant.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    await connectDB();

    const jobId = event.path.split('/job/')[1];
    const body = JSON.parse(event.body);

    const job = await Job.findOne({ _id: jobId, status: 'active' });
    if (!job) {
      return {
        statusCode: 404,
        body: JSON.stringify({ success: false, message: 'Active job not found' }),
      };
    }

    const applicant = await Applicant.create({ ...body, job: job._id, recruiter: job.recruiter });
    await Job.findByIdAndUpdate(job._id, { $inc: { applicantCount: 1 } });

    return {
      statusCode: 201,
      body: JSON.stringify({ success: true, data: applicant }),
    };
  } catch (error) {
    console.error('Create applicant error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Server error' }),
    };
  }
};