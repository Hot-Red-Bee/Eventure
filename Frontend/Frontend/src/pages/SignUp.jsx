import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUserPlus, FaBan, FaCheckCircle, FaArrowLeft } from 'react-icons/fa';

// Mock API response for testing (replace with real POST /signup)
const mockSignUpResponse = { success: true, message: 'User registered successfully' };

const SignUp = () => {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'attendee',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleToggle = () => {
    setIsAdmin(!isAdmin);
    setFormData({ ...formData, role: isAdmin ? 'attendee' : 'admin' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError('Please fill out all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    // Mock API call (replace with POST /signup)
    if (mockSignUpResponse.success) {
      setSuccess(mockSignUpResponse.message);
      setTimeout(() => navigate(formData.role === 'admin' ? '/admin' : '/dashboard'), 2000);
    } else {
      setError('Registration failed. Please try again.');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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
        <FaUserPlus className="mr-2 text-[var(--color-accent)]" />
        {isAdmin ? 'Admin Sign Up' : 'User Sign Up'}
      </h2>
      <div className="max-w-full sm:max-w-md mx-auto mb-4">
        <button
          onClick={handleToggle}
          className="w-full px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:bg-[var(--color-accent)]/80 transition flex items-center justify-center text-sm sm:text-base shadow-md"
        >
          <FaUserPlus className="mr-2" />
          Switch to {isAdmin ? 'User' : 'Admin'} Sign Up
        </button>
      </div>
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
          <label htmlFor="name" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Full Name *
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Email *
          </label>
          <input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Enter your email"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Password *
          </label>
          <input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Enter your password"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Confirm Password *
          </label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Confirm your password"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition flex items-center justify-center text-sm sm:text-base shadow-md"
        >
          <FaUserPlus className="mr-2" />
          Sign Up
        </button>
      </form>
      <p className="text-center text-[var(--color-text)] text-sm sm:text-base mt-4">
        Already have an account?{' '}
        <Link to="/login" className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition">
          Log in
        </Link>
      </p>
    </motion.div>
  );
};

export default SignUp;