import connectDB from '../utils/db.js';
import { protect } from '../utils/auth.js';
import Applicant from '../../server/models/Applicant.js';

const buildFilter = (query, recruiterId) => {
  const filter = { recruiter: recruiterId };
  if (query.status) filter.status = query.status;
  if (query.search) filter.$or = [{ name: new RegExp(query.search, 'i') }, { email: new RegExp(query.search, 'i') }];
  if (query.job) filter.job = query.job;
  return filter;
};

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
    const query = event.queryStringParameters || {};

    const page = Number(query.page || 1);
    const limit = Number(query.limit || 15);
    const filter = buildFilter(query, user._id);

    const total = await Applicant.countDocuments(filter);
    const data = await Applicant.find(filter).populate('job', 'title').sort({ appliedAt: -1 }).skip((page - 1) * limit).limit(limit);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data,
        pagination: { total, page, pages: Math.ceil(total / limit), limit }
      }),
    };
  } catch (error) {
    console.error('List applicants error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};