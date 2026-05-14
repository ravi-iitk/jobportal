import connectDB from '../utils/db.js';
import { protect } from '../utils/auth.js';
import Job from '../../server/models/Job.js';

const buildJobFilter = (query, recruiterId) => {
  const filter = { recruiter: recruiterId };
  if (query.search) filter.$or = [{ title: new RegExp(query.search, 'i') }, { location: new RegExp(query.search, 'i') }];
  if (query.type) filter.type = query.type;
  if (query.category) filter.category = query.category;
  if (query.status) filter.status = query.status;
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
    const limit = Number(query.limit || 10);
    const sortBy = query.sortBy || 'createdAt';
    const order = query.order === 'asc' ? 1 : -1;
    const filter = buildJobFilter(query, user._id);

    const total = await Job.countDocuments(filter);
    const data = await Job.find(filter)
      .sort({ [sortBy]: order })
      .skip((page - 1) * limit)
      .limit(limit);

    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        data,
        pagination: { total, page, pages: Math.ceil(total / limit), limit }
      }),
    };
  } catch (error) {
    console.error('List jobs error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};