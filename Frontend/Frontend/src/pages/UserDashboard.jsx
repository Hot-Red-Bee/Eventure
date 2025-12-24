import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaUser, FaSignOutAlt, FaUserShield, FaCalendarAlt, FaBell, FaTimes, FaBan, FaArrowLeft } from 'react-icons/fa';
import { userAPI, rsvpAPI, eventAPI } from '../utilis/api';

// lightweight mock fallback used only if API calls fail
const mockUser = { id: 1, name: 'John Doe', email: 'john@example.com', role: 'attendee' };
const mockEvents = [
  { id: 1, title: 'Campus Tech Talk', date: '2025-09-15', location: { name: 'Main Hall' } },
  { id: 2, title: 'Music Festival', date: '2025-10-01', location: { name: 'Outdoor Quad' } },
];
const mockRSVPs = [
  { id: 1, userId: 1, eventId: 1, status: 'confirmed', notes: 'Needs wheelchair access', timestamp: '2025-09-01T10:00:00Z' },
  { id: 2, userId: 1, eventId: 2, status: 'confirmed', notes: '', timestamp: '2025-09-02T12:00:00Z' },
];

const UserDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [rsvps, setRsvps] = useState([]);
  const [events, setEvents] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const meRes = await userAPI.getProfile().catch(() => null);
        const me = meRes?.user || meRes || null;

        // if no authenticated user, fall back to mock (keeps dev flow)
        if (!me) {
          setUser(mockUser);
          setEvents(mockEvents);
          setRsvps(mockRSVPs.filter((r) => r.userId === mockUser.id));
          buildNotifications(mockRSVPs.filter((r) => r.userId === mockUser.id), mockEvents);
          return;
        }

        setUser(me);

        const [rsvpsRes, eventsRes] = await Promise.all([
          rsvpAPI.getUserRSVPs(me.id).catch(() => []),
          eventAPI.getAllEvents().catch(() => []),
        ]);

        const rsvpsList = rsvpsRes?.rsvps || rsvpsRes || [];
        setRsvps(Array.isArray(rsvpsList) ? rsvpsList : []);

        const eventsList = eventsRes?.events || eventsRes || [];
        setEvents(Array.isArray(eventsList) ? eventsList : []);

        buildNotifications(rsvpsList, eventsList);
      } catch (err) {
        console.error('Dashboard load error:', err);
        // fallback to mock data on error to keep UI usable in dev
        setUser(mockUser);
        setEvents(mockEvents);
        setRsvps(mockRSVPs.filter((r) => r.userId === mockUser.id));
        buildNotifications(mockRSVPs.filter((r) => r.userId === mockUser.id), mockEvents);
        setError('Failed to load live data — showing demo data.');
      } finally {
        setLoading(false);
      }
    };

    const buildNotifications = (rsvpsList, eventsList) => {
      const newNotifications = [];
      rsvpsList.forEach((rsvp) => {
        const event = (eventsList || []).find((e) => Number(e.id) === Number(rsvp.eventId));
        if (event) {
          newNotifications.push({
            id: `rsvp-${rsvp.id}`,
            message: `You have RSVP'd to ${event.title} on ${event.date ? new Date(event.date).toLocaleDateString() : 'TBD'}.`,
            type: 'rsvp',
            timestamp: rsvp.timestamp || new Date().toISOString(),
          });
          const eventDate = event.date ? new Date(event.date) : null;
          if (eventDate) {
            const today = new Date();
            const daysUntilEvent = Math.ceil((eventDate - today) / (1000 * 60 * 60 * 24));
            if (daysUntilEvent > 0 && daysUntilEvent <= 7) {
              newNotifications.push({
                id: `reminder-${rsvp.id}`,
                message: `Reminder: ${event.title} is happening in ${daysUntilEvent} day${daysUntilEvent > 1 ? 's' : ''}!`,
                type: 'reminder',
                timestamp: new Date().toISOString(),
              });
            }
          }
        }
      });
      setNotifications(newNotifications);
    };

    load();
  }, []);

  const handleLogout = () => {
    // replace with real logout (authAPI.logout etc.) if implemented
    setUser(null);
    navigate('/login');
  };

  const dismissNotification = (id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleBack = () => {
    if (window.history.length > 1) navigate(-1);
    else navigate('/');
  };

  if (loading) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.25 }} className="container mx-auto py-6 px-4">
        <p className="text-[var(--color-text)]">Loading dashboard...</p>
      </motion.div>
    );
  }

  if (!user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-6 sm:py-8 bg-[var(--color-background)] px-4"
      >
        <p className="text-red-600 text-sm sm:text-base flex items-center">
          <FaBan className="mr-2" /> {error || 'You are not logged in.'}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="container mx-auto py-6 sm:py-10 px-4 bg-[var(--color-background)]"
    >
      <div className="mb-4">
        <button
          onClick={handleBack}
          className="inline-flex items-center px-3 py-2 rounded-md text-[var(--color-text)] bg-white/0 hover:bg-white/5 transition text-sm sm:text-base shadow-sm"
          aria-label="Go back"
        >
          <FaArrowLeft className="mr-2 text-[var(--color-primary)]" />
          Back
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <aside className="md:col-span-1 bg-white p-4 rounded-xl shadow">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
              <FaUser />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">{user.name}</p>
              <p className="text-sm text-[var(--color-text)]/70">{user.email}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link to="/events" className="block px-3 py-2 rounded hover:bg-[var(--color-primary)]/5 text-[var(--color-text)]">
              <span className="inline-flex items-center"><FaCalendarAlt className="mr-2" /> Events</span>
            </Link>

            <Link to="/profile" className="block px-3 py-2 rounded hover:bg-[var(--color-primary)]/5 text-[var(--color-text)]">
              <span className="inline-flex items-center"><FaUser className="mr-2" /> Profile</span>
            </Link>

            {user.role === 'admin' && (
              <Link to="/admin" className="block px-3 py-2 rounded hover:bg-[var(--color-primary)]/5 text-[var(--color-text)]">
                <span className="inline-flex items-center"><FaUserShield className="mr-2" /> Admin</span>
              </Link>
            )}

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded hover:bg-red-50 text-[var(--color-text)] flex items-center"
            >
              <FaSignOutAlt className="mr-2 text-[var(--color-primary)]" /> Logout
            </button>
          </nav>
        </aside>

        <section className="md:col-span-3 space-y-6">
          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-[var(--color-text)] mb-3">Notifications</h3>
            {notifications.length === 0 ? (
              <p className="text-sm text-[var(--color-text)]/70">No notifications</p>
            ) : (
              <ul className="space-y-2">
                {notifications.map((n) => (
                  <li key={n.id} className="flex justify-between items-center bg-[var(--color-background)]/50 p-2 rounded">
                    <span className="text-[var(--color-text)] text-sm">{n.message}</span>
                    <button onClick={() => dismissNotification(n.id)} className="text-sm text-[var(--color-primary)]">
                      <FaTimes />
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <div className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold text-[var(--color-text)] mb-3">Your RSVPs</h3>
            {rsvps.length === 0 ? (
              <p className="text-sm text-[var(--color-text)]/70">You have no RSVPs yet. Browse <Link to="/events" className="text-[var(--color-primary)]">events</Link>.</p>
            ) : (
              <ul className="space-y-3">
                {rsvps.map((r) => {
                  const ev = events.find((e) => Number(e.id) === Number(r.eventId)) || { title: 'Unknown event', date: '', location: {} };
                  return (
                    <li key={r.id} className="p-3 rounded border border-[var(--color-text)]/10">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-[var(--color-text)]">{ev.title}</p>
                          <p className="text-sm text-[var(--color-text)]/70">{ev.date ? new Date(ev.date).toLocaleDateString() : ev.date} • {ev.location?.name || '-'}</p>
                          {r.notes && <p className="text-sm text-[var(--color-text)]/80 mt-1">Notes: {r.notes}</p>}
                        </div>
                        <div className={`text-sm ${r.status === 'confirmed' ? 'text-[var(--color-accent)]' : 'text-red-600'}`}>{r.status}</div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </section>
      </div>
    </motion.div>
  );
};

export default UserDashboard;