// API utility functions for making HTTP requests
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

// Generic API request function
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  // Add auth token if available
  const token = localStorage.getItem('authToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
};

// Auth API calls
export const authAPI = {
  login: (credentials) => 
    apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    }),

  signup: (userData) => 
    apiRequest('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(userData),
    }),

  logout: () => 
    apiRequest('/auth/logout', {
      method: 'POST',
    }),

  resetPassword: (email) => 
    apiRequest('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),

  confirmResetPassword: (token, newPassword) => 
    apiRequest('/auth/reset-password/confirm', {
      method: 'POST',
      body: JSON.stringify({ token, newPassword }),
    }),

  changePassword: (currentPassword, newPassword) => 
    apiRequest('/auth/change-password', {
      method: 'PUT',
      body: JSON.stringify({ currentPassword, newPassword }),
    }),
};

// User API calls
export const userAPI = {
  getProfile: () => apiRequest('/users/profile'),
  
  updateProfile: (userData) => 
    apiRequest('/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  getAllUsers: () => apiRequest('/users'),

  updateUser: (userId, userData) => 
    apiRequest(`/users/${userId}`, {
      method: 'PUT',
      body: JSON.stringify(userData),
    }),

  deleteUser: (userId) => 
    apiRequest(`/users/${userId}`, {
      method: 'DELETE',
    }),
};

// Event API calls
export const eventAPI = {
  getAllEvents: (filters = {}) => {
    const queryParams = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value) queryParams.append(key, value);
    });
    const queryString = queryParams.toString();
    return apiRequest(`/events${queryString ? `?${queryString}` : ''}`);
  },

  getEvent: (eventId) => apiRequest(`/events/${eventId}`),

  createEvent: (eventData) => 
    apiRequest('/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    }),

  updateEvent: (eventId, eventData) => 
    apiRequest(`/events/${eventId}`, {
      method: 'PUT',
      body: JSON.stringify(eventData),
    }),

  deleteEvent: (eventId) => 
    apiRequest(`/events/${eventId}`, {
      method: 'DELETE',
    }),
};

// RSVP API calls
export const rsvpAPI = {
  createRSVP: (rsvpData) => 
    apiRequest('/rsvps', {
      method: 'POST',
      body: JSON.stringify(rsvpData),
    }),

  getUserRSVPs: (userId) => apiRequest(`/rsvps?userId=${userId}`),

  getEventRSVPs: (eventId) => apiRequest(`/rsvps?eventId=${eventId}`),

  updateRSVP: (rsvpId, rsvpData) => 
    apiRequest(`/rsvps/${rsvpId}`, {
      method: 'PUT',
      body: JSON.stringify(rsvpData),
    }),

  deleteRSVP: (rsvpId) => 
    apiRequest(`/rsvps/${rsvpId}`, {
      method: 'DELETE',
    }),
};

// Category and Location API calls
export const categoryAPI = {
  getAllCategories: () => apiRequest('/categories'),
  
  createCategory: (categoryData) => 
    apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(categoryData),
    }),
};

export const locationAPI = {
  getAllLocations: () => apiRequest('/locations'),
  
  createLocation: (locationData) => 
    apiRequest('/locations', {
      method: 'POST',
      body: JSON.stringify(locationData),
    }),
};

export default {
  authAPI,
  userAPI,
  eventAPI,
  rsvpAPI,
  categoryAPI,
  locationAPI,
};