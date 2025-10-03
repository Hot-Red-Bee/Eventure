import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaBan, FaCheckCircle, FaLock, FaArrowLeft } from 'react-icons/fa';


// Mock user and RSVP data (replace with API calls to GET /users/:id and GET /rsvps?userId=:id)
const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' };
const mockEvents = [
  { id: 1, title: 'Campus Tech Talk', date: '2025-09-15', location: { name: 'Main Hall' } },
  { id: 2, title: 'Music Festival', date: '2025-10-01', location: { name: 'Outdoor Quad' } },
];
const mockRSVPs = [
  { id: 1, userId: 1, eventId: 1, status: 'confirmed', waitlist: false, notes: 'Needs wheelchair access', timestamp: '2025-09-01T10:00:00Z' },
  { id: 2, userId: 1, eventId: 2, status: 'confirmed', waitlist: false, notes: '', timestamp: '2025-09-02T12:00:00Z' },
];

const Profile = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Simulate fetching user data
  useEffect(() => {
    // Replace with API call to GET /users/:id
    if (mockUser) {
      setFormData({ name: mockUser.name, email: mockUser.email, role: mockUser.role });
    } else {
      setError('User not found. Please log in.');
    }
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Validation
    if (!formData.name || !formData.email) {
      setError('Please fill out all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Mock API call (replace with PUT /users/:id)
    console.log({ ...formData });
    setSuccess('Profile updated successfully!');
    setTimeout(() => navigate('/events'), 2000);
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
        <p className="text-red-600 text-sm sm:text-base">{error}</p>
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
        <FaUser className="mr-2 text-[var(--color-accent)]" />
        User Profile
      </h2>
      <div className="max-w-full sm:max-w-lg mx-auto space-y-6">
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
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
              value={formData?.name || ''}
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
              value={formData?.email || ''}
              onChange={handleChange}
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
              placeholder="Enter your email"
              required
            />
          </div>
          <div>
            <label htmlFor="role" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              value={formData?.role || ''}
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] bg-gray-100 cursor-not-allowed text-sm sm:text-base"
              disabled
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition flex items-center justify-center text-sm sm:text-base shadow-md"
          >
            <FaCheckCircle className="mr-2" />
            Update Profile
          </button>
          <Link
            to="/change-password"
            className="inline-flex items-center px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:bg-[var(--color-accent)]/80 transition mt-4 text-sm sm:text-base shadow-md w-full justify-center"
          >
            <FaLock className="mr-2" />
            Change Password
          </Link>
        </form>
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-4">My RSVPs</h3>
          {mockRSVPs.length === 0 ? (
            <p className="text-[var(--color-text)] text-sm sm:text-base">No RSVPs yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base text-[var(--color-text)]">
                <thead>
                  <tr className="bg-[var(--color-primary)]/10">
                    <th className="p-2 text-left">Event</th>
                    <th className="p-2 text-left hidden sm:table-cell">Date</th>
                    <th className="p-2 text-left hidden md:table-cell">Location</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left hidden sm:table-cell">Notes</th>
                  </tr>
                </thead>
                <tbody>
                  {mockRSVPs.map((rsvp) => {
                    const event = mockEvents.find((e) => e.id === rsvp.eventId);
                    return (
                      <tr key={rsvp.id} className="border-b border-[var(--color-text)]/10 hover:bg-[var(--color-background)]">
                        <td className="p-2">{event?.title || 'Unknown Event'}</td>
                        <td className="p-2 hidden sm:table-cell">{event?.date ? new Date(event.date).toLocaleDateString() : '-'}</td>
                        <td className="p-2 hidden md:table-cell">{event?.location?.name || '-'}</td>
                        <td className="p-2 capitalize">
                          <span className={rsvp.status === 'confirmed' ? 'text-[var(--color-accent)]' : 'text-red-600'}>
                            {rsvp.status}
                          </span>
                        </td>
                        <td className="p-2 hidden sm:table-cell">{rsvp.notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default Profile;