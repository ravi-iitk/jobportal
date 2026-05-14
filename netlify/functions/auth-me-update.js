import connectDB from './utils/db.js';
import { protect } from './utils/auth.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'PUT') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    await connectDB();

    const user = await protect(event);
    const body = JSON.parse(event.body);

    console.log('UpdateMe called with body:', body);
    const allowed = ['name', 'company', 'avatar', 'password'];
    allowed.forEach((field) => {
      if (body[field] !== undefined && body[field] !== '') user[field] = body[field];
    });
    console.log('User fields to update:', user);
    await user.save();

    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, user }),
    };
  } catch (error) {
    console.error('UpdateMe error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};