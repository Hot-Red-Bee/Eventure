import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaLock, FaBan, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';
import { authAPI } from '../utilis/api';

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await authAPI.resetPassword(email);
      const message = res?.message || res?.msg || 'Password reset link sent. Check your email.';
      setSuccess(message);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      console.error('Reset password error:', err);
      setError(err?.response?.data?.message || err?.message || 'Failed to send reset link. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

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
        Reset Password
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
          <label htmlFor="email" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Email *
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Enter your email"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition flex items-center justify-center text-sm sm:text-base shadow-md disabled:opacity-60"
        >
          <FaLock className="mr-2" />
          {submitting ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>

      <p className="text-center text-[var(--color-text)] text-sm sm:text-base mt-4">
        Remember your password?{' '}
        <Link to="/login" className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition">
          Log in
        </Link>
      </p>
    </motion.div>
  );
};

export default ResetPassword;