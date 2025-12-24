import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaBan, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';
import  { eventAPI, userAPI, categoryAPI, locationAPI } from '../utilis/api';

const CreateEvent = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [locations, setLocations] = useState([]);
  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '',
    endTime: '',
    seatLimit: '',
    status: 'draft',
    bannerImage: '',
    locationId: '',
    categoryId: '',
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [meRes, categoriesRes, locationsRes] = await Promise.all([
          userAPI.getProfile().catch(() => null),
          categoryAPI.getAllCategories().catch(() => []),
          locationAPI.getAllLocations().catch(() => []),
        ]);

        const me = meRes?.user || meRes || null;
        setCurrentUser(me);

        const cats = categoriesRes?.categories || categoriesRes || [];
        setCategories(Array.isArray(cats) ? cats : []);

        const locs = locationsRes?.locations || locationsRes || [];
        setLocations(Array.isArray(locs) ? locs : []);
      } catch (err) {
        console.error('Failed to load create-event data', err);
        setError('Failed to load required data.');
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

    if (!currentUser || currentUser.role !== 'admin') {
      setError('Only admins can create events.');
      return;
    }

    const {
      title,
      description,
      date,
      startTime,
      endTime,
      seatLimit,
      locationId,
      categoryId,
      status,
      bannerImage,
    } = formData;

    if (!title || !description || !date || !startTime || !endTime || !seatLimit || !locationId || !categoryId) {
      setError('Please fill out all required fields.');
      return;
    }

    const seat = Number(seatLimit);
    if (!Number.isInteger(seat) || seat <= 0) {
      setError('Seat limit must be a positive integer.');
      return;
    }

    const payload = {
      title,
      description,
      date,
      startTime,
      endTime,
      seatLimit: seat,
      locationId: Number(locationId),
      categoryId: Number(categoryId),
      status,
      bannerImage: bannerImage || null,
      organizerId: currentUser.id,
    };

    try {
      setSubmitting(true);
      const res = await eventAPI.createEvent(payload);
      const created = res.event || res || null;
      setSuccess('Event created successfully!');
      setTimeout(() => navigate('/admin'), 1200);
      // optional: if you want to navigate to the event page:
       if (created?.id) navigate(`/events/${created.id}`);
    } catch (err) {
      console.error('Create event error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to create event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="container mx-auto py-6 px-4">
        <p className="text-[var(--color-text)]">Loading...</p>
      </motion.div>
    );
  }

  if (!currentUser || currentUser.role !== 'admin') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.2 }}
        className="container mx-auto py-6 sm:py-8 bg-[var(--color-background)] px-4"
      >
        <p className="text-red-600">Access denied. Admins only.</p>
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
          onClick={() => history.back()}
          className="inline-flex items-center px-3 py-2 rounded-md text-[var(--color-text)] bg-white/0 hover:bg-white/5 transition text-sm sm:text-base shadow-sm"
          aria-label="Go back"
        >
          <FaArrowLeft className="mr-2 text-[var(--color-primary)]" />
          Back
        </button>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-6 flex items-center">
        <FaCalendarAlt className="mr-2 text-[var(--color-accent)]" />
        Create New Event
      </h2>

      <form onSubmit={handleSubmit} className="max-w-full sm:max-w-lg mx-auto space-y-4 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
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
          <label htmlFor="title" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Event Title *</label>
          <input id="title" name="title" value={formData.title} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Enter event title" required />
        </div>

        <div>
          <label htmlFor="description" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Description *</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleChange} rows="4" className="w-full p-2 border rounded-lg" placeholder="Describe the event" required />
        </div>

        <div>
          <label htmlFor="date" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Date *</label>
          <input id="date" name="date" type="date" value={formData.date} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Start Time *</label>
            <input id="startTime" name="startTime" type="time" value={formData.startTime} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">End Time *</label>
            <input id="endTime" name="endTime" type="time" value={formData.endTime} onChange={handleChange} className="w-full p-2 border rounded-lg" required />
          </div>
        </div>

        <div>
          <label htmlFor="seatLimit" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Seat Limit *</label>
          <input id="seatLimit" name="seatLimit" type="number" min="1" value={formData.seatLimit} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Enter seat limit" required />
        </div>

        <div>
          <label htmlFor="status" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Status *</label>
          <select id="status" name="status" value={formData.status} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        <div>
          <label htmlFor="bannerImage" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Banner Image URL</label>
          <input id="bannerImage" name="bannerImage" value={formData.bannerImage} onChange={handleChange} className="w-full p-2 border rounded-lg" placeholder="Enter image URL (optional)" />
        </div>

        <div>
          <label htmlFor="locationId" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Location *</label>
          <select id="locationId" name="locationId" value={formData.locationId} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
            <option value="">Select a location</option>
            {locations.map((loc) => (
              <option key={loc.id} value={loc.id}>{loc.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="categoryId" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">Category *</label>
          <select id="categoryId" name="categoryId" value={formData.categoryId} onChange={handleChange} className="w-full p-2 border rounded-lg" required>
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={submitting} className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition flex items-center justify-center shadow-md">
          <FaCheckCircle className="mr-2" />
          {submitting ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </motion.div>
  );
};

export default CreateEvent;
