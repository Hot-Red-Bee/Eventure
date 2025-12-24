// Authentication utility functions
import { authAPI } from './api';

// Token management
export const getAuthToken = () => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem('authToken', token);
  } else {
    localStorage.removeItem('authToken');
  }
};

export const removeAuthToken = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('user');
};

// User data management
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('user');
  return userStr ? JSON.parse(userStr) : null;
};

export const setCurrentUser = (user) => {
  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  } else {
    localStorage.removeItem('user');
  }
};

// Authentication state checks
export const isAuthenticated = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  return !!(token && user);
};

export const isAdmin = () => {
  const user = getCurrentUser();
  return user && user.role === 'admin';
};

export const isAttendee = () => {
  const user = getCurrentUser();
  return user && user.role === 'attendee';
};

// Authentication actions
export const login = async (credentials) => {
  try {
    const response = await authAPI.login(credentials);
    
    if (response.token && response.user) {
      setAuthToken(response.token);
      setCurrentUser(response.user);
      return { success: true, user: response.user };
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Login failed:', error);
    return { success: false, error: error.message };
  }
};

export const signup = async (userData) => {
  try {
    const response = await authAPI.signup(userData);
    
    if (response.token && response.user) {
      setAuthToken(response.token);
      setCurrentUser(response.user);
      return { success: true, user: response.user };
    } else {
      throw new Error('Invalid response from server');
    }
  } catch (error) {
    console.error('Signup failed:', error);
    return { success: false, error: error.message };
  }
};

export const logout = async () => {
  try {
    // Call logout API to invalidate token on server
    await authAPI.logout();
  } catch (error) {
    console.error('Logout API call failed:', error);
    // Continue with local logout even if API call fails
  } finally {
    // Always clear local storage
    removeAuthToken();
    setCurrentUser(null);
  }
};

export const resetPassword = async (email) => {
  try {
    const response = await authAPI.resetPassword(email);
    return { success: true, message: response.message };
  } catch (error) {
    console.error('Password reset failed:', error);
    return { success: false, error: error.message };
  }
};

export const confirmResetPassword = async (token, newPassword) => {
  try {
    const response = await authAPI.confirmResetPassword(token, newPassword);
    return { success: true, message: response.message };
  } catch (error) {
    console.error('Password reset confirmation failed:', error);
    return { success: false, error: error.message };
  }
};

export const changePassword = async (currentPassword, newPassword) => {
  try {
    const response = await authAPI.changePassword(currentPassword, newPassword);
    return { success: true, message: response.message };
  } catch (error) {
    console.error('Password change failed:', error);
    return { success: false, error: error.message };
  }
};

// Token validation and refresh
export const validateToken = async () => {
  const token = getAuthToken();
  if (!token) return false;

  try {
    // You can implement a token validation endpoint
    // For now, we'll assume token is valid if it exists
    return true;
  } catch (error) {
    console.error('Token validation failed:', error);
    removeAuthToken();
    setCurrentUser(null);
    return false;
  }
};

// Route protection helpers
export const requireAuth = () => {
  if (!isAuthenticated()) {
    throw new Error('Authentication required');
  }
  return getCurrentUser();
};

export const requireAdmin = () => {
  const user = requireAuth();
  if (!isAdmin()) {
    throw new Error('Admin access required');
  }
  return user;
};

// Initialize auth state on app load
export const initializeAuth = () => {
  const token = getAuthToken();
  const user = getCurrentUser();
  
  if (token && user) {
    // Validate token on app initialization
    validateToken().then(isValid => {
      if (!isValid) {
        removeAuthToken();
        setCurrentUser(null);
      }
    });
  }
};

export default {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  getCurrentUser,
  setCurrentUser,
  isAuthenticated,
  isAdmin,
  isAttendee,
  login,
  signup,
  logout,
  resetPassword,
  confirmResetPassword,
  changePassword,
  validateToken,
  requireAuth,
  requireAdmin,
  initializeAuth,
};