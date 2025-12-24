
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaBan, FaArrowLeft } from 'react-icons/fa';
import { userAPI, eventAPI, rsvpAPI } from '../utilis/api';

const RSVP = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const query = new URLSearchParams(location.search);
  const eventId = query.get('eventId');

  const [currentUser, setCurrentUser] = useState(null);
  const [eventData, setEventData] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    status: 'confirmed',
    notes: '',
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [meRes, eventRes] = await Promise.all([
          userAPI.getProfile().catch(() => null),
          eventId ? eventAPI.getEvent(eventId).catch(() => null) : Promise.resolve(null),
        ]);
        const me = meRes?.user || meRes || null;
        setCurrentUser(me);
        const evt = eventRes?.event || eventRes || null;
        setEventData(evt);
      } catch (err) {
        console.error('Failed to load RSVP page data', err);
        setError(err?.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [eventId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((s) => ({ ...s, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!eventId) {
      setError('No event specified.');
      return;
    }

    if (!currentUser) {
      setError('Please log in to RSVP.');
      return;
    }

    const isFull = (eventData?.rsvpCount || 0) >= (eventData?.seatLimit || 0);
    if (isFull && formData.status === 'confirmed') {
      setError('Event is full. Choose waitlist or contact organizer.');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        eventId: Number(eventId),
        status: formData.status,
        notes: formData.notes || '',
      };
      const res = await rsvpAPI.createRSVP(payload);
      const created = res?.rsvp || res || null;
      setSuccess('RSVP submitted successfully!');
      setTimeout(() => navigate('/events'), 1500);
    } catch (err) {
      console.error('RSVP error', err);
      setError(err?.response?.data?.message || err.message || 'Failed to submit RSVP');
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
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
        RSVP{eventData ? ` for ${eventData.title}` : ''}
      </h2>

      {!eventData ? (
        <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-md mx-auto">
          <p className="text-red-600">Event not found.</p>
        </div>
      ) : (
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
            <p className="text-[var(--color-text)] text-sm sm:text-base">
              Seats available: {(eventData.seatLimit || 0) - (eventData.rsvpCount || 0)} / {eventData.seatLimit || 0}
            </p>
          </div>

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
              <option value="waitlist">Waitlist</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>

          <div>
            <label htmlFor="notes" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
              Notes (accessibility, questions)
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="4"
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
              placeholder="Any special requests?"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition flex items-center justify-center text-sm sm:text-base shadow-md disabled:opacity-60"
          >
            <FaCheckCircle className="mr-2" />
            {submitting ? 'Submitting...' : 'Submit RSVP'}
          </button>
        </form>
      )}
    </motion.div>
  );
};

export default RSVP;
