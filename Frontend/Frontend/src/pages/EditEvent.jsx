
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaBan, FaCalendarAlt, FaArrowLeft } from 'react-icons/fa';

// Mock user and data (replace with API calls to /events/:id, /locations, /categories)
const mockUser = { id: 1, name: 'John Doe', role: 'admin' };
const mockLocations = [
  { id: 1, name: 'Main Hall' },
  { id: 2, name: 'Outdoor Quad' },
];
const mockCategories = [
  { id: 1, name: 'Tech' },
  { id: 2, name: 'Music' },
];
const mockEvents = [
  {
    id: 1,
    title: 'Campus Tech Talk',
    description: 'Join us for a deep dive into AI and ML technologies.',
    date: '2025-09-15',
    startTime: '14:00',
    endTime: '16:00',
    seatLimit: 50,
    status: 'published',
    bannerImage: '/assets/images/banner.jpg',
    locationId: 1,
    categoryId: 1,
    organizerId: 1,
  },
  {
    id: 2,
    title: 'Music Festival',
    description: 'Celebrate with live bands and food stalls!',
    date: '2025-10-01',
    startTime: '18:00',
    endTime: '22:00',
    seatLimit: 200,
    status: 'draft',
    bannerImage: '/assets/images/banner.jpg',
    locationId: 2,
    categoryId: 2,
    organizerId: 1,
  },
];

const EditEvent = () => {
  const { eventId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Simulate fetching event data
  useEffect(() => {
    // Replace with API call to GET /events/:id
    const event = mockEvents.find((e) => e.id === parseInt(eventId));
    if (event) {
      setFormData({ ...event });
    } else {
      setError('Event not found.');
    }
  }, [eventId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mockUser || mockUser.role !== 'admin') {
      setError('Only admins can edit events.');
      return;
    }
    if (!formData.title || !formData.date || !formData.startTime || !formData.endTime || !formData.seatLimit || !formData.locationId || !formData.categoryId) {
      setError('Please fill out all required fields.');
      return;
    }
    if (parseInt(formData.seatLimit) <= 0) {
      setError('Seat limit must be greater than 0.');
      return;
    }
    // Mock API call (replace with PUT /events/:id)
    console.log({
      ...formData,
      seatLimit: parseInt(formData.seatLimit),
      locationId: parseInt(formData.locationId),
      categoryId: parseInt(formData.categoryId),
      organizerId: parseInt(formData.organizerId),
    });
    setSuccess('Event updated successfully!');
    setTimeout(() => navigate('/admin'), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  if (!mockUser || mockUser.role !== 'admin') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-6 sm:py-8 bg-[var(--color-background)] px-4"
      >
        <p className="text-red-600 text-sm sm:text-base">Access denied. Admins only.</p>
      </motion.div>
    );
  }

  if (!formData) {
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
        <FaCalendarAlt className="mr-2 text-[var(--color-accent)]" />
        Edit Event: {formData.title}
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
          <label htmlFor="title" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Event Title *
          </label>
          <input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Enter event title"
            required
          />
        </div>
        <div>
          <label htmlFor="description" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            rows="4"
            placeholder="Describe the event"
            required
          ></textarea>
        </div>
        <div>
          <label htmlFor="date" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Date *
          </label>
          <input
            id="date"
            name="date"
            type="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="startTime" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
              Start Time *
            </label>
            <input
              id="startTime"
              name="startTime"
              type="time"
              value={formData.startTime}
              onChange={handleChange}
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
              required
            />
          </div>
          <div>
            <label htmlFor="endTime" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
              End Time *
            </label>
            <input
              id="endTime"
              name="endTime"
              type="time"
              value={formData.endTime}
              onChange={handleChange}
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="seatLimit" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Seat Limit *
          </label>
          <input
            id="seatLimit"
            name="seatLimit"
            type="number"
            value={formData.seatLimit}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Enter seat limit"
            required
            min="1"
          />
        </div>
        <div>
          <label htmlFor="status" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Status *
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            required
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="bannerImage" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Banner Image URL
          </label>
          <input
            id="bannerImage"
            name="bannerImage"
            value={formData.bannerImage}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            placeholder="Enter image URL (optional)"
          />
        </div>
        <div>
          <label htmlFor="locationId" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Location *
          </label>
          <select
            id="locationId"
            name="locationId"
            value={formData.locationId}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            required
          >
            <option value="">Select a location</option>
            {mockLocations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="categoryId" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Category *
          </label>
          <select
            id="categoryId"
            name="categoryId"
            value={formData.categoryId}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            required
          >
            <option value="">Select a category</option>
            {mockCategories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition flex items-center justify-center text-sm sm:text-base shadow-md"
        >
          <FaCheckCircle className="mr-2" />
          Update Event
        </button>
      </form>
    </motion.div>
  );
};

export default EditEvent;