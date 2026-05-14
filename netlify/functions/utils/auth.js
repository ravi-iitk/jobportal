import jwt from 'jsonwebtoken';
import User from '../../../server/models/User.js';

export const protect = async (event) => {
  try {
    const headers = event.headers;
    const authHeader = headers.authorization || headers.Authorization;
    console.log('Auth header:', authHeader ? 'present' : 'missing');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('Not authorised, token missing');
    }

    const token = authHeader.split(' ')[1];
    console.log('Token:', token ? 'present' : 'missing');
    if (!token) {
      throw new Error('Not authorised, token missing');
    }

    console.log('JWT_SECRET:', process.env.JWT_SECRET ? 'set' : 'not set');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded token:', decoded);
    const user = await User.findById(decoded.id).select('-password');
    console.log('User found:', user ? 'yes' : 'no');

    if (!user) {
      throw new Error('User no longer exists');
    }

    return user;
  } catch (error) {
    console.error('Auth middleware error:', error.name, error.message);
    if (error.name === 'TokenExpiredError') {
      throw new Error('Token expired');
    }
    if (error.name === 'JsonWebTokenError') {
      throw new Error('Invalid token');
    }
    throw new Error('Not authorised, token invalid');
  }
};