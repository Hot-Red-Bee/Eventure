import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaTimes, FaCheckCircle, FaBan, FaSearch, FaArrowLeft } from 'react-icons/fa';
import { userAPI, eventAPI, categoryAPI, rsvpAPI } from '../utilis/api';

const EventCard = ({ event, user, handleRSVP, handleCancelRSVP, userRSVPs }) => {
  const userRsvp = userRSVPs.find((r) => r.eventId === event.id && r.userId === user?.id);
  const isRSVPed = Boolean(userRsvp);
  const isFull = (event.rsvpCount || 0) >= (event.seatLimit || 0);

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      {event.bannerImage ? (
        <img src={event.bannerImage} alt={event.title} className="w-full h-48 object-cover" />
      ) : (
        <div className="w-full h-48 bg-gray-100 flex items-center justify-center text-gray-400">No image</div>
      )}
      <div className="p-4">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)]">{event.title}</h3>
        <p className="text-[var(--color-text)] text-sm sm:text-base mt-1">{event.description}</p>
        <p className="text-[var(--color-text)] text-sm sm:text-base mt-2">
          <span className="font-medium">Date:</span> {event.date ? new Date(event.date).toLocaleDateString() : '-'}
        </p>
        <p className="text-[var(--color-text)] text-sm sm:text-base">
          <span className="font-medium">Time:</span> {event.startTime || '-'} - {event.endTime || '-'}
        </p>
        <p className="text-[var(--color-text)] text-sm sm:text-base">
          <span className="font-medium">Location:</span> {event.location?.name || '-'}
        </p>
        <p className="text-[var(--color-text)] text-sm sm:text-base">
          <span className="font-medium">Seats:</span> {(event.seatLimit || 0) - (event.rsvpCount || 0)}/{event.seatLimit || 0}
        </p>
        <p className="text-[var(--color-text)] text-sm sm:text-base">
          <span className="font-medium">Category:</span> {event.category?.name || '-'}
        </p>

        {user && (
          <div className="mt-4 flex space-x-2">
            {isRSVPed ? (
              <button
                onClick={() => handleCancelRSVP(userRsvp.id)}
                className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center justify-center text-sm sm:text-base shadow-md"
              >
                <FaBan className="mr-2" />
                Cancel RSVP
              </button>
            ) : (
              <button
                onClick={() => handleRSVP(event.id)}
                disabled={isFull}
                className={`flex-1 px-4 py-2 text-white rounded-xl transition flex items-center justify-center text-sm sm:text-base shadow-md ${
                  isFull ? 'bg-gray-400 cursor-not-allowed' : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80'
                }`}
              >
                <FaCheckCircle className="mr-2" />
                {isFull ? 'Event Full' : 'RSVP'}
              </button>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
};

const Events = () => {
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [search, setSearch] = useState('');
  const [events, setEvents] = useState([]);
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [userRSVPs, setUserRSVPs] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoading(true);
        const mePromise = userAPI.getProfile().catch(() => null);
        const eventsPromise = eventAPI.getAllEvents().catch(() => []);
        const categoriesPromise = categoryAPI.getAllCategories().catch(() => []);
        const [meRes, eventsRes, categoriesRes] = await Promise.all([mePromise, eventsPromise, categoriesPromise]);

        const me = meRes?.user || meRes || null;
        setCurrentUser(me);

        const evts = eventsRes?.events || eventsRes || [];
        // normalize event list to array
        setEvents(Array.isArray(evts) ? evts : []);

        const cats = categoriesRes?.categories || categoriesRes || [];
        setCategories(Array.isArray(cats) ? cats : []);

        if (me) {
          // try to fetch RSVPs for current user
          const rsvpsRes = await rsvpAPI.getUserRSVPs(me.id).catch(() => []);
          const rsvps = rsvpsRes?.rsvps || rsvpsRes || [];
          setUserRSVPs(Array.isArray(rsvps) ? rsvps : []);
        } else {
          setUserRSVPs([]);
        }
      } catch (err) {
        console.error('Failed to load events page data', err);
        setError(err?.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    loadAll();
  }, []);

  useEffect(() => {
    let result = [...events];
    if (categoryId) {
      result = result.filter((event) => String(event.category?.id || event.categoryId) === String(categoryId));
    }
    if (date) {
      result = result.filter((event) => event.date && new Date(event.date) >= new Date(date));
    }
    if (search) {
      const q = search.toLowerCase();
      result = result.filter(
        (event) =>
          (event.title || '').toLowerCase().includes(q) ||
          (event.description || '').toLowerCase().includes(q)
      );
    }
    setFilteredEvents(result);
  }, [events, categoryId, date, search]);

  const handleClearFilters = () => {
    setCategoryId('');
    setDate('');
    setSearch('');
    setFilteredEvents(events);
  };

  const handleRSVP = async (eventId) => {
    if (!currentUser) {
      setError('Please log in to RSVP.');
      setTimeout(() => setError(''), 2500);
      return;
    }
    try {
      setError('');
      const res = await rsvpAPI.createRSVP({ eventId }).catch((e) => { throw e; });
      const newRsvp = res?.rsvp || res || null;
      if (newRsvp) {
        setUserRSVPs((prev) => [...prev, newRsvp]);
        setEvents((prev) => prev.map((ev) => (ev.id === eventId ? { ...ev, rsvpCount: (ev.rsvpCount || 0) + 1 } : ev)));
        setSuccess('RSVP successful!');
        setTimeout(() => setSuccess(''), 2000);
      } else {
        // if backend returns minimal data, refetch RSVPs and events
        const [rsvpsRes, eventsRes] = await Promise.all([rsvpAPI.getUserRSVPs(currentUser.id), eventAPI.getAllEvents()]);
        setUserRSVPs(rsvpsRes?.rsvps || rsvpsRes || []);
        setEvents(eventsRes?.events || eventsRes || []);
        setSuccess('RSVP successful!');
        setTimeout(() => setSuccess(''), 2000);
      }
    } catch (err) {
      console.error('RSVP error', err);
      setError(err?.response?.data?.message || err.message || 'Failed to RSVP');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleCancelRSVP = async (rsvpId) => {
    if (!currentUser) {
      setError('Please log in to cancel RSVP.');
      setTimeout(() => setError(''), 2500);
      return;
    }
    try {
      await rsvpAPI.deleteRSVP(rsvpId);
      const rsvp = userRSVPs.find((r) => r.id === rsvpId);
      setUserRSVPs((prev) => prev.filter((r) => r.id !== rsvpId));
      if (rsvp?.eventId) {
        setEvents((prev) => prev.map((ev) => (ev.id === rsvp.eventId ? { ...ev, rsvpCount: Math.max(0, (ev.rsvpCount || 1) - 1) } : ev)));
      }
      setSuccess('RSVP cancelled successfully!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error('Cancel RSVP error', err);
      setError(err?.response?.data?.message || err.message || 'Failed to cancel RSVP');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
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
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 sm:py-8 bg-[var(--color-background)] px-4"
    >
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-3 py-2 rounded-md text-[var(--color-text)] bg-white/0 hover:bg-white/5 transition text-sm sm:text-base shadow-sm cursor-pointer"
          aria-label="Go back"
        >
          <FaArrowLeft className="mr-2 text-[var(--color-primary)]" />
          Back
        </button>
      </div>

      <h2 className="text-2xl sm:text-3xl font-bold text-[var(--color-primary)] mb-6 flex items-center">
        <FaFilter className="mr-2 text-[var(--color-accent)]" />
        Upcoming Events
      </h2>

      {error && (
        <p className="text-red-600 flex items-center text-sm sm:text-base mb-4">
          <FaBan className="mr-2" /> {error}
        </p>
      )}
      {success && (
        <p className="text-[var(--color-accent)] flex items-center text-sm sm:text-base mb-4">
          <FaCheckCircle className="mr-2" /> {success}
        </p>
      )}

      <div className="mb-6 bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
              Search
            </label>
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[var(--color-text)]/50" />
              <input
                id="search"
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
                placeholder="Search by title or description"
              />
            </div>
          </div>

          <div>
            <label htmlFor="categoryId" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
              Category
            </label>
            <select
              id="categoryId"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="date" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
              Date (Events After)
            </label>
            <input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
            />
          </div>
        </div>

        {(categoryId || date || search) && (
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center text-sm sm:text-base"
          >
            <FaTimes className="mr-2" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredEvents.length === 0 ? (
          <p className="text-[var(--color-text)] text-sm sm:text-base">No events match your filters.</p>
        ) : (
          filteredEvents.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              user={currentUser}
              handleRSVP={handleRSVP}
              handleCancelRSVP={handleCancelRSVP}
              userRSVPs={userRSVPs}
            />
          ))
        )}
      </div>
    </motion.div>
  );
};

export default Events;