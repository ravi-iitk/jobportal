import nodemailer from 'nodemailer';
import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

const createTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) return null;
  return nodemailer.createTransport({
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

export const signup = async (req, res) => {
  const { name, email, password, company } = req.body;
  const exists = await User.findOne({ email });
  if (exists) return res.status(409).json({ success: false, message: 'Email already registered' });

  const user = await User.create({ name, email, password, company, emailVerified: true });
  const token = generateToken(user);

  res.status(201).json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, company: user.company, avatar: user.avatar }
  });
};

export const requestSignupOtp = async (req, res) => {
  const { name, email, password, company } = req.body;
  const existing = await User.findOne({ email });
  if (existing && existing.emailVerified) return res.status(409).json({ success: false, message: 'Email already registered' });

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
    res.json({ success: true, message: 'Verification code sent to email.' });
  } catch (error) {
    console.error(`[OTP] Failed to send verification code to ${email}:`, error);
    return res.status(500).json({ success: false, message: 'Failed to send OTP email. Check server logs.' });
  }
};

export const verifySignupOtp = async (req, res) => {
  const { email, otp } = req.body;
  const user = await User.findOne({ email, emailOtp: otp });
  if (!user || !user.otpExpires || user.otpExpires < Date.now()) {
    return res.status(400).json({ success: false, message: 'Invalid or expired OTP' });
  }

  user.emailVerified = true;
  user.emailOtp = '';
  user.otpExpires = undefined;
  await user.save();

  const token = generateToken(user);
  res.json({ success: true, token, user: { _id: user._id, name: user.name, email: user.email, company: user.company, avatar: user.avatar } });
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');
  if (!user || !(await user.matchPassword(password))) {
    return res.status(401).json({ success: false, message: 'Invalid email or password' });
  }

  if (!user.emailVerified) {
    return res.status(403).json({ success: false, message: 'Email not verified. Please verify with your OTP.' });
  }

  const token = generateToken(user);
  res.json({
    success: true,
    token,
    user: { _id: user._id, name: user.name, email: user.email, company: user.company, avatar: user.avatar }
  });
};

export const me = async (req, res) => {
  console.log('Me endpoint called, user:', req.user ? req.user._id : 'no user');
  res.json({ success: true, user: req.user });
};

export const updateMe = async (req, res) => {
  console.log('UpdateMe called with body:', req.body);
  const allowed = ['name', 'company', 'avatar', 'password'];
  allowed.forEach((field) => {
    if (req.body[field] !== undefined && req.body[field] !== '') req.user[field] = req.body[field];
  });
  console.log('User fields to update:', req.user);
  await req.user.save();
  res.json({ success: true, user: req.user });
};
