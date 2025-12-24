import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaBan, FaCheckCircle, FaLock, FaArrowLeft } from 'react-icons/fa';
import { userAPI, rsvpAPI, eventAPI } from '../utilis/api';

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', role: '' });
  const [rsvps, setRsvps] = useState([]);
  const [eventsMap, setEventsMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const meRes = await userAPI.getProfile().catch(() => null);
        const me = meRes?.user || meRes || null;
        if (!me) {
          setError('User not found. Please log in.');
          return;
        }
        setUser(me);
        setFormData({ name: me.name || '', email: me.email || '', role: me.role || '' });

        const rsvpsRes = await rsvpAPI.getUserRSVPs(me.id).catch(() => []);
        const rsvpsList = rsvpsRes?.rsvps || rsvpsRes || [];
        setRsvps(Array.isArray(rsvpsList) ? rsvpsList : []);

        // Build events map: try to fetch all events and map by id (backend may return events list)
        const eventsRes = await eventAPI.getAllEvents().catch(() => []);
        const eventsList = eventsRes?.events || eventsRes || [];
        const map = {};
        if (Array.isArray(eventsList)) {
          eventsList.forEach((ev) => {
            if (ev?.id) map[ev.id] = ev;
          });
        }
        setEventsMap(map);
      } catch (err) {
        console.error(err);
        setError(err?.response?.data?.message || err.message || 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!formData.name || !formData.email) {
      setError('Please fill out all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError('Please enter a valid email address.');
      return;
    }

    try {
      setSaving(true);
      const res = await userAPI.updateProfile({ name: formData.name, email: formData.email });
      const updated = res?.user || res || null;
      setUser(updated || user);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Update profile error:', err);
      setError(err?.response?.data?.message || err.message || 'Failed to update profile');
      setTimeout(() => setError(''), 3000);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="container mx-auto py-6 px-4">
        <p className="text-[var(--color-text)]">Loading profile...</p>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="container mx-auto py-6 sm:py-8 bg-[var(--color-background)] px-4"
      >
        <p className="text-red-600 text-sm sm:text-base">{error || 'Please log in.'}</p>
        <p className="mt-4">
          <Link to="/login" className="text-[var(--color-primary)]">Go to Login</Link>
        </p>
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
            <label htmlFor="name" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Full Name *</label>
            <input id="name" name="name" type="text" value={formData.name} onChange={handleChange}
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
              placeholder="Enter your full name" required />
          </div>

          <div>
            <label htmlFor="email" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Email *</label>
            <input id="email" name="email" type="email" value={formData.email} onChange={handleChange}
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
              placeholder="Enter your email" required />
          </div>

          <div>
            <label htmlFor="role" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Role</label>
            <input id="role" name="role" type="text" value={formData.role} disabled
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] bg-gray-100 cursor-not-allowed text-sm sm:text-base" />
          </div>

          <button type="submit" disabled={saving}
            className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition flex items-center justify-center text-sm sm:text-base shadow-md disabled:opacity-60">
            <FaCheckCircle className="mr-2" /> {saving ? 'Saving...' : 'Update Profile'}
          </button>

          <Link to="/change-password" className="inline-flex items-center px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:bg-[var(--color-accent)]/80 transition mt-4 text-sm sm:text-base shadow-md w-full justify-center">
            <FaLock className="mr-2" /> Change Password
          </Link>
        </form>

        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
          <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-4">My RSVPs</h3>

          {rsvps.length === 0 ? (
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
                  {rsvps.map((rsvp) => {
                    const ev = eventsMap[rsvp.eventId];
                    return (
                      <tr key={rsvp.id} className="border-b border-[var(--color-text)]/10 hover:bg-[var(--color-background)]">
                        <td className="p-2">{ev?.title || `Event #${rsvp.eventId}`}</td>
                        <td className="p-2 hidden sm:table-cell">{ev?.date ? new Date(ev.date).toLocaleDateString() : '-'}</td>
                        <td className="p-2 hidden md:table-cell">{ev?.location?.name || '-'}</td>
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