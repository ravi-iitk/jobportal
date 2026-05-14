import api from './axiosInstance';
export const getDashboardStats = () => api.get('/jobs/stats/dashboard');
export const getJobs = (params) => api.get('/jobs', { params });
export const getJob = (id) => api.get(`/jobs/${id}`);
export const createJob = (data) => api.post('/jobs', data);
export const updateJob = (id, data) => api.put(`/jobs/${id}`, data);
export const deleteJob = (id) => api.delete(`/jobs/${id}`);
export const updateJobStatus = (id, status) => api.patch(`/jobs/${id}/status`, { status });
