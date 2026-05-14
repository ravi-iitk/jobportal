import connectDB from './utils/db.js';
import User from '../../server/models/User.js';
import nodemailer from 'nodemailer';

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransporter({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: process.env.SMTP_SECURE === 'true',
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    },
    logger: true,
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 10000,
    tls: {
      rejectUnauthorized: false
    }
  });
};

const sendVerificationOtp = async (email, otp) => {
  const transporter = createTransporter();
  const subject = 'Your recruiter portal verification code';
  const text = `Your verification code is ${otp}. It expires in 10 minutes.`;
  const html = `<p>Your verification code is <strong>${otp}</strong>.</p><p>It expires in 10 minutes.</p>`;

  if (!transporter) {
    console.log(`[OTP] Verification code for ${email}: ${otp}`);
    return;
  }

  try {
    await transporter.verify();
    console.log(`[OTP] SMTP transporter verified for ${process.env.SMTP_USER}`);
    await transporter.sendMail({
      from: process.env.EMAIL_FROM || process.env.SMTP_USER,
      to: email,
      subject,
      text,
      html
    });
  } catch (error) {
    console.error(`[OTP] SMTP send failed for ${email}:`, error);
    throw error;
  }
};

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

export const handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ success: false, message: 'Method not allowed' }),
    };
  }

  try {
    await connectDB();

    const { name, email, password, company } = JSON.parse(event.body);
    const existing = await User.findOne({ email });
    if (existing && existing.emailVerified) return {
      statusCode: 409,
      body: JSON.stringify({ success: false, message: 'Email already registered' }),
    };

    const otp = generateOtp();
    const otpExpires = Date.now() + 10 * 60 * 1000;

    let user = existing;
    if (!user) {
      user = new User({ name, email, password, company, emailVerified: false, emailOtp: otp, otpExpires });
    } else {
      user.name = name;
      user.company = company;
      user.password = password;
      user.emailVerified = false;
      user.emailOtp = otp;
      user.otpExpires = otpExpires;
    }

    await user.save();

    try {
      await sendVerificationOtp(email, otp);
      console.log(`[OTP] Sent verification code to ${email}`);
      return {
        statusCode: 200,
        body: JSON.stringify({ success: true, message: 'Verification code sent to email.' }),
      };
    } catch (error) {
      console.error(`[OTP] Failed to send verification code to ${email}:`, error);
      return {
        statusCode: 500,
        body: JSON.stringify({ success: false, message: 'Failed to send OTP email. Check server logs.' }),
      };
    }
  } catch (error) {
    console.error('Request OTP error:', error);
    return {
      statusCode: 500,
      body: JSON.stringify({ success: false, message: 'Server error' }),
    };
  }
};