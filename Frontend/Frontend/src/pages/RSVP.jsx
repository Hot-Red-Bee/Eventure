
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaBan, FaArrowLeft} from 'react-icons/fa';

// Mock user and event (replace with API/auth)
const mockUser = { id: 1, name: 'John Doe', role: 'attendee' };
const mockEvent = {
  id: 1,
  title: 'Campus Tech Talk',
  seatLimit: 50,
  rsvpCount: 20,
};

const RSVP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const eventId = query.get('eventId');

  const [formData, setFormData] = useState({
    status: 'confirmed',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!mockUser) {
      setError('Please log in to RSVP.');
      return;
    }
    if (mockEvent.rsvpCount >= mockEvent.seatLimit && formData.status === 'confirmed') {
      setError('Event is full. You can join the waitlist.');
      return;
    }
    // Mock API call (replace with real /rsvps POST)
    console.log({
      userId: mockUser.id,
      eventId,
      status: formData.status,
      notes: formData.notes,
      waitlist: mockEvent.rsvpCount >= mockEvent.seatLimit,
    });
    setSuccess('RSVP submitted successfully!');
    setTimeout(() => navigate('/events'), 2000);
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

      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-6">
        RSVP for {mockEvent.title}
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
          <label htmlFor="status" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Status
          </label>
          <select
            id="status"
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
          >
            <option value="confirmed">Confirmed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
        <div>
          <label htmlFor="notes" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
            Notes (e.g., accessibility needs)
          </label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            rows="4"
            placeholder="Any special requests?"
          ></textarea>
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition flex items-center justify-center text-sm sm:text-base shadow-md"
        >
          <FaCheckCircle className="mr-2" />
          Submit RSVP
        </button>
      </form>
    </motion.div>
  );
};

export default RSVP;