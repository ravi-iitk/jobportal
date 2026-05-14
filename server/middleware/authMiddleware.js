import jwt from 'jsonwebtoken';
import User from '../models/User.js';

export const protect = async (req, res, next) => {
  try {
    const header = req.headers.authorization;
    console.log('Auth header:', header ? 'present' : 'missing');
    if (!header || !header.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Not authorised, token missing' });
    }

    const token = header.split(' ')[1];
    console.log('Token:', token ? 'present' : 'missing');
    if (!token) {
      return res.status(401).json({ success: false, message: 'Not authorised, token missing' });
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'not set');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    const user = await User.findById(decoded.id).select('-password');
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User no longer exists' });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error.name, error.message);
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ success: false, message: 'Token expired' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ success: false, message: 'Invalid token' });
    }
    return res.status(401).json({ success: false, message: 'Not authorised, token invalid' });
  }
};
