import api from './axiosInstance';
export const getApplicants = (params) => api.get('/applicants', { params });
export const getApplicant = (id) => api.get(`/applicants/${id}`);
export const updateApplicantStatus = (id, status) => api.patch(`/applicants/${id}/status`, { status });
export const updateApplicantNotes = (id, notes) => api.put(`/applicants/${id}/notes`, { notes });
export const deleteApplicant = (id) => api.delete(`/applicants/${id}`);
