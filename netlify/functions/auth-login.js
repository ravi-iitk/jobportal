import connectDB from './utils/db.js';
import User from '../../server/models/User.js';
import generateToken from '../../server/utils/generateToken.js';

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    await connectDB();

    const { email, password } = JSON.parse(event.body);

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.matchPassword(password))) {
      return {
        statusCode: 401,
        body: JSON.stringify({ success: false, message: 'Invalid email or password' }),
      };
    }

    if (!user.emailVerified) {
      return {
        statusCode: 403,
        body: JSON.stringify({ success: false, message: 'Email not verified. Please verify with your OTP.' }),
      };
    }

    const token = generateToken(user);
    return {
      statusCode: 200,
      body: JSON.stringify({
        success: true,
        token,
        user: { _id: user._id, name: user.name, email: user.email, company: user.company, avatar: user.avatar }
      }),
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Server error' }),
    };
  }
};