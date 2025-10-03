import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaBan, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

// Mock user and API response (replace with real auth and PUT /users/:id/password)
const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' };
const mockChangePasswordResponse = { success: true, message: 'Password updated successfully' };

const ChangePassword = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmNewPassword: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (formData.newPassword !== formData.confirmNewPassword) {
      setError('New passwords do not match.');
      return;
    }
    if (formData.newPassword.length < 6) {
      setError('New password must be at least 6 characters long.');
      return;
    }
    // Mock auth check (replace with real auth via src/utils/auth.js)
    if (!mockUser) {
      setError('Please log in to change your password.');
      return;
    }
    // Mock API call (replace with PUT /users/:id/password)
    if (formData.currentPassword === 'password' && mockChangePasswordResponse.success) {
      setSuccess(mockChangePasswordResponse.message);
      setTimeout(() => navigate('/profile'), 2000);
    } else {
      setError('Current password is incorrect.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!mockUser) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-6 sm:py-8 bg-[var(--color-background)] px-4"
      >
        <p className="text-red-600 text-sm sm:text-base">Please log in to change your password.</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 sm:py-8 bg-[var(--color-background)] px-4"
    >
      <div className="mb-4">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center px-3 py-2 rounded-md text-[var(--color-text)] bg-white/0 hover:bg-white/5 transition text-sm sm:text-base shadow-sm"
          aria-label="Go back"
        >
          <FaArrowLeft className="mr-2 text-[var(--color-primary)]" />
          Back
        </button>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-6 flex items-center">
        <FaLock className="mr-2 text-[var(--color-accent)]" />
        Change Password
      </h2>
      <form onSubmit={handleSubmit} className="max-w-full sm:max-w-md mx-auto space-y-4 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        {error && (
          <p className="text-red-600 flex items-center text-sm sm:text-base">
            <FaBan className="mr-2" /> {error}
          </p>
        )}
        {success && (
          <p className="text-[var(--color-accent)] flex items-center text-sm sm:text-base">
            <FaCheckCircle className="mr-2" /> {success}
          </p>
        )}
        <div>
          <label htmlFor="currentPassword" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Current Password *
          </label>
          <input
            id="currentPassword"
            name="currentPassword"
            type="password"
            value={formData.currentPassword}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Enter current password"
            required
          />
        </div>
        <div>
          <label htmlFor="newPassword" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            New Password *
          </label>
          <input
            id="newPassword"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Enter new password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmNewPassword" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Confirm New Password *
          </label>
          <input
            id="confirmNewPassword"
            name="confirmNewPassword"
            type="password"
            value={formData.confirmNewPassword}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Confirm new password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition flex items-center justify-center text-sm sm:text-base shadow-md"
        >
          <FaLock className="mr-2" />
          Change Password
        </button>
      </form>
      <p className="text-center text-[var(--color-text)] text-sm sm:text-base mt-4">
        Back to{' '}
        <Link to="/Profile" className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition">
          Profile
        </Link>
      </p>
    </motion.div>
  );
};

export default ChangePassword;