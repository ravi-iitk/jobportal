import connectDB from './utils/db.js';
import { protect } from './utils/auth.js';

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
    return {
      statusCode: 200,
      body: JSON.stringify({ success: true, user }),
    };
  } catch (error) {
    console.error('Me error:', error);
    return {
      statusCode: 401,
      body: JSON.stringify({ success: false, message: error.message }),
    };
  }
};