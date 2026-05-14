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

    const { email, otp } = JSON.parse(event.body);
    const user = await User.findOne({ email, emailOtp: otp });
    if (!user || !user.otpExpires || user.otpExpires < Date.now()) {
      return {
        statusCode: 400,
        body: JSON.stringify({ success: false, message: 'Invalid or expired OTP' }),
      };
    }

    user.emailVerified = true;
    user.emailOtp = '';
    user.otpExpires = undefined;
    await user.save();

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
    console.error('Verify OTP error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Server error' }),
    };
  }
};