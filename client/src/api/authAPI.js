import api from './axiosInstance';
export const signupAPI = (data) => api.post('/auth/signup', data);
export const loginAPI = (data) => api.post('/auth/login', data);
export const requestSignupOtpAPI = (data) => api.post('/auth/signup/request-otp', data);
export const verifySignupOtpAPI = (data) => api.post('/auth/signup/verify-otp', data);
export const meAPI = () => api.get('/auth/me');
export const updateMeAPI = (data) => api.put('/auth/me', data);
