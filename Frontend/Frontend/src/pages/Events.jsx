
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { FaFilter, FaTimes, FaCheckCircle, FaBan, FaSearch, FaArrowLeft } from 'react-icons/fa';

// Mock user, events, categories, and RSVPs (replace with API calls)
const mockUser = { id: 1, name: 'John Doe', role: 'attendee' };
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
    location: { id: 1, name: 'Main Hall' },
    category: { id: 1, name: 'Tech' },
    rsvpCount: 20,
  },
  {
    id: 2,
    title: 'Music Festival',
    description: 'Celebrate with live bands and food stalls!',
    date: '2025-10-01',
    startTime: '18:00',
    endTime: '22:00',
    seatLimit: 200,
    status: 'published',
    bannerImage: '/assets/images/banner.jpg',
    location: { id: 2, name: 'Outdoor Quad' },
    category: { id: 2, name: 'Music' },
    rsvpCount: 0,
  },
];
const mockCategories = [
  { id: 1, name: 'Tech' },
  { id: 2, name: 'Music' },
];
const mockRSVPs = [
  { id: 1, userId: 1, eventId: 1, status: 'confirmed', waitlist: false, notes: 'Needs wheelchair access', timestamp: '2025-09-01T10:00:00Z' },
];

// Mock EventCard component (update src/components/EventCard.jsx)
const EventCard = ({ event, user, handleRSVP, handleCancelRSVP, userRSVPs }) => {
  const isRSVPed = userRSVPs.some((rsvp) => rsvp.eventId === event.id && rsvp.userId === user?.id);
  const isFull = (event.rsvpCount || 0) >= event.seatLimit;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-lg overflow-hidden"
    >
      <img src={event.bannerImage} alt={event.title} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)]">{event.title}</h3>
        <p className="text-[var(--color-text)] text-sm sm:text-base mt-1">{event.description}</p>
        <p className="text-[var(--color-text)] text-sm sm:text-base mt-2">
          <span className="font-medium">Date:</span> {new Date(event.date).toLocaleDateString()}
        </p>
        <p className="text-[var(--color-text)] text-sm sm:text-base">
          <span className="font-medium">Time:</span> {event.startTime} - {event.endTime}
        </p>
        <p className="text-[var(--color-text)] text-sm sm:text-base">
          <span className="font-medium">Location:</span> {event.location.name}
        </p>
        <p className="text-[var(--color-text)] text-sm sm:text-base">
          <span className="font-medium">Seats:</span> {event.seatLimit - (event.rsvpCount || 0)}/{event.seatLimit}
        </p>
        <p className="text-[var(--color-text)] text-sm sm:text-base">
          <span className="font-medium">Category:</span> {event.category.name}
        </p>
        {user && (
          <div className="mt-4 flex space-x-2">
            {isRSVPed ? (
              <button
                onClick={() => handleCancelRSVP(userRSVPs.find((rsvp) => rsvp.eventId === event.id).id)}
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
                  isFull
                    ? 'bg-gray-400 cursor-not-allowed'
                    : 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80'
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
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [userRSVPs, setUserRSVPs] = useState(mockRSVPs);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    let result = mockEvents;
    if (categoryId) {
      result = result.filter((event) => event.category.id === parseInt(categoryId));
    }
    if (date) {
      result = result.filter((event) => new Date(event.date) >= new Date(date));
    }
    if (search) {
      result = result.filter(
        (event) =>
          event.title.toLowerCase().includes(search.toLowerCase()) ||
          event.description.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredEvents(result);
  }, [categoryId, date, search]);

  const handleClearFilters = () => {
    setCategoryId('');
    setDate('');
    setSearch('');
    setFilteredEvents(mockEvents);
  };

  const handleRSVP = (eventId) => {
    if (!mockUser) {
      setError('Please log in to RSVP.');
      return;
    }
    // Mock POST /rsvps
    const newRSVP = {
      id: userRSVPs.length + 1,
      userId: mockUser.id,
      eventId,
      status: 'confirmed',
      waitlist: false,
      notes: '',
      timestamp: new Date().toISOString(),
    };
    setUserRSVPs([...userRSVPs, newRSVP]);
    setFilteredEvents(
      filteredEvents.map((event) =>
        event.id === eventId ? { ...event, rsvpCount: (event.rsvpCount || 0) + 1 } : event
      )
    );
    setSuccess('RSVP successful!');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleCancelRSVP = (rsvpId) => {
    if (!mockUser) {
      setError('Please log in to cancel RSVP.');
      return;
    }
    // Mock DELETE /rsvps/:id
    const rsvp = userRSVPs.find((r) => r.id === rsvpId);
    setUserRSVPs(userRSVPs.filter((r) => r.id !== rsvpId));
    setFilteredEvents(
      filteredEvents.map((event) =>
        event.id === rsvp.eventId ? { ...event, rsvpCount: (event.rsvpCount || 0) - 1 } : event
      )
    );
    setSuccess('RSVP cancelled successfully!');
    setTimeout(() => setSuccess(''), 2000);
  };
const handleBack = () => {
    // If there is a previous entry in history use -1, otherwise go to home
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
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
              {mockCategories.map((category) => (
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
              user={mockUser}
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