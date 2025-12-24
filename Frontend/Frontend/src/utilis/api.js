// API utility functions for making HTTP requests
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE,
  withCredentials: true, // send cookies (httpOnly auth cookie)
  headers: {
    'Content-Type': 'application/json',
  },
});

// helper to set/remove Authorization header (if you use token auth)
export const setAuthToken = (token) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials).then((r) => r.data),
  signup: (userData) => api.post('/auth/register', userData).then((r) => r.data),
  logout: () => api.post('/auth/logout').then((r) => r.data),
  resetPassword: (email) => api.post('/auth/reset-password', { email }).then((r) => r.data),
  confirmResetPassword: (token, newPassword) =>
    api.post('/auth/reset-password/confirm', { token, newPassword }).then((r) => r.data),
  changePassword: (currentPassword, newPassword) =>
    api.put('/auth/change-password', { currentPassword, newPassword }).then((r) => r.data),
};

// User API
export const userAPI = {
  getProfile: () => api.get('/users/me').then((r) => r.data),
  updateProfile: (userData) => api.put('/users/me', userData).then((r) => r.data),
  getAllUsers: () => api.get('/users').then((r) => r.data),
  updateUser: (userId, userData) => api.put(`/users/${userId}`, userData).then((r) => r.data),
  deleteUser: (userId) => api.delete(`/users/${userId}`).then((r) => r.data),
};

// Event API
export const eventAPI = {
  getAllEvents: (filters = {}) => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([k, v]) => { if (v !== undefined && v !== '') params.append(k, v); });
    const qs = params.toString();
    return api.get(`/events${qs ? `?${qs}` : ''}`).then((r) => r.data);
  },
  getEvent: (eventId) => api.get(`/events/${eventId}`).then((r) => r.data),
  createEvent: (eventData) => api.post('/events', eventData).then((r) => r.data),
  updateEvent: (eventId, eventData) => api.put(`/events/${eventId}`, eventData).then((r) => r.data),
  deleteEvent: (eventId) => api.delete(`/events/${eventId}`).then((r) => r.data),
};

// RSVP API
export const rsvpAPI = {
  createRSVP: (rsvpData) => api.post('/rsvps', rsvpData).then((r) => r.data),
  getUserRSVPs: (userId) => api.get(`/rsvps${userId ? `?userId=${userId}` : ''}`).then((r) => r.data),
  getEventRSVPs: (eventId) => api.get(`/rsvps?eventId=${eventId}`).then((r) => r.data),
  updateRSVP: (rsvpId, rsvpData) => api.put(`/rsvps/${rsvpId}`, rsvpData).then((r) => r.data),
  deleteRSVP: (rsvpId) => api.delete(`/rsvps/${rsvpId}`).then((r) => r.data),
};

// Category API
export const categoryAPI = {
  getAllCategories: () => api.get('/categories').then((r) => r.data),
  createCategory: (categoryData) => api.post('/categories', categoryData).then((r) => r.data),
};

// Location API
export const locationAPI = {
  getAllLocations: () => api.get('/locations').then((r) => r.data),
  createLocation: (locationData) => api.post('/locations', locationData).then((r) => r.data),
};



export default api;