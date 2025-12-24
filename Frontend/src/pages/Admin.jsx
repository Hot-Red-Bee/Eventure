import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utilis/api';
import { motion } from 'framer-motion';
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaUsers,
  FaTimes,
  FaUserEdit,
  FaArrowLeft,
  FaSignOutAlt,
  FaBan,
  FaCheckCircle,
} from 'react-icons/fa';

const Admin = () => {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  const [events, setEvents] = useState([]);
  const [users, setUsers] = useState([]);
  const [rsvps, setRsvps] = useState([]);
  const [categories, setCategories] = useState([]);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);

  const [editUser, setEditUser] = useState(null);

  useEffect(() => {
    const loadAll = async () => {
      try {
        setLoadingUser(true);
        const [meRes, eventsRes, usersRes, categoriesRes, rsvpsRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/events'),
          api.get('/users'),
          api.get('/categories'),
          api.get('/rsvps'),
        ]);

        setCurrentUser(meRes.data.user || meRes.data);
        setEvents(eventsRes.data.events || eventsRes.data || []);
        setUsers(usersRes.data.users || usersRes.data || []);
        setCategories(categoriesRes.data.categories || categoriesRes.data || []);
        setRsvps(rsvpsRes.data.rsvps || rsvpsRes.data || []);
      } catch (err) {
        console.error('Failed to load admin data:', err);
        setError(err.response?.data?.message || err.message || 'Failed to load data');
      } finally {
        setLoadingUser(false);
      }
    };
    loadAll();
  }, []);

  useEffect(() => {
    let result = [...events];
    if (categoryId) {
      result = result.filter((e) => String(e.category?.id || e.categoryId) === String(categoryId));
    }
    if (date) {
      result = result.filter((e) => new Date(e.date) >= new Date(date));
    }
    setFilteredEvents(result);
  }, [events, categoryId, date]);

  const handleClearFilters = () => {
    setCategoryId('');
    setDate('');
    setFilteredEvents(events);
  };

  const handleDelete = async (eventId) => {
    if (!window.confirm('Are you sure you want to delete this event?')) return;
    try {
      await api.delete(`/events/${eventId}`);
      setEvents((prev) => prev.filter((e) => e.id !== eventId));
      setSuccess('Event deleted');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to delete event');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleViewRSVPs = (eventId) => {
    setSelectedEventId(eventId === selectedEventId ? null : eventId);
  };

  const handleEditUser = (user) => {
    setEditUser({ ...user });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editUser?.name || !editUser?.email) {
      setError('Please fill out all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editUser.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    try {
      const res = await api.put(`/users/${editUser.id}`, {
        name: editUser.name,
        email: editUser.email,
        role: editUser.role,
      });
      // update list
      setUsers((prev) => prev.map((u) => (u.id === editUser.id ? res.data.user || res.data : u)));
      setSuccess('User updated successfully!');
      setEditUser(null);
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to update user');
      setTimeout(() => setError(''), 3000);
    }
  };

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
    } catch (err) {
      // ignore
    } finally {
      navigate('/login');
    }
  };

  if (!currentUser || currentUser.role !== 'admin') {
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
        <FaUsers className="mr-2 text-[var(--color-accent)]" />
        Admin Dashboard
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
      <Link
        to="/create-event"
        className="inline-flex items-center px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition mt-4 mb-6 text-sm sm:text-base shadow-md"
      >
        <FaPlus className="mr-2" />
        Create New Event
      </Link>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-4">Filter Events</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
        {(categoryId || date) && (
          <button
            onClick={handleClearFilters}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition flex items-center text-sm sm:text-base"
          >
            <FaTimes className="mr-2" />
            Clear Filters
          </button>
        )}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg mb-6">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-4">Manage Events</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base text-[var(--color-text)]">
            <thead>
              <tr className="bg-[var(--color-primary)]/10">
                <th className="p-2 text-left">Title</th>
                <th className="p-2 text-left hidden sm:table-cell">Date</th>
                <th className="p-2 text-left hidden md:table-cell">Location</th>
                <th className="p-2 text-left">Status</th>
                <th className="p-2 text-left">Seats</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEvents.map((event) => (
                <tr key={event.id} className="border-b border-[var(--color-text)]/10 hover:bg-[var(--color-background)]">
                  <td className="p-2">{event.title}</td>
                  <td className="p-2 hidden sm:table-cell">{event.date ? new Date(event.date).toLocaleDateString() : '-'}</td>
                  <td className="p-2 hidden md:table-cell">{event.location?.name || '-'}</td>
                  <td className="p-2 capitalize">
                    <span className={String(event.status).toLowerCase() === 'published' ? 'text-[var(--color-accent)]' : 'text-red-600'}>
                      {event.status}
                    </span>
                  </td>
                  <td className="p-2">{(event.seatLimit || 0) - (event.rsvpCount || 0)}/{event.seatLimit || 0}</td>
                  <td className="p-2 flex space-x-2">
                    <button
                      onClick={() => handleViewRSVPs(event.id)}
                      className="text-[var(--color-accent)] hover:text-[var(--color-accent)]/80 transition"
                      title="View RSVPs"
                    >
                      <FaUsers />
                    </button>
                    <Link
                      to={`/edit-event/${event.id}`}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition"
                      title="Edit Event"
                    >
                      <FaEdit />
                    </Link>
                    <button
                      onClick={() => handleDelete(event.id)}
                      className="text-red-600 hover:text-red-700 transition"
                      title="Delete Event"
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedEventId && (
          <div className="mt-6">
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-4">
              RSVPs for {events.find((e) => e.id === selectedEventId)?.title || '-'}
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-sm sm:text-base text-[var(--color-text)]">
                <thead>
                  <tr className="bg-[var(--color-primary)]/10">
                    <th className="p-2 text-left">User ID</th>
                    <th className="p-2 text-left">Status</th>
                    <th className="p-2 text-left hidden sm:table-cell">Notes</th>
                    <th className="p-2 text-left hidden md:table-cell">Timestamp</th>
                  </tr>
                </thead>
                <tbody>
                  {rsvps
                    .filter((rsvp) => rsvp.eventId === selectedEventId)
                    .map((rsvp) => (
                      <tr key={rsvp.id} className="border-b border-[var(--color-text)]/10 hover:bg-[var(--color-background)]">
                        <td className="p-2">{rsvp.userId}</td>
                        <td className="p-2 capitalize">
                          <span className={String(rsvp.status).toLowerCase() === 'confirmed' ? 'text-[var(--color-accent)]' : 'text-red-600'}>
                            {String(rsvp.status).toLowerCase()}
                          </span>
                        </td>
                        <td className="p-2 hidden sm:table-cell">{rsvp.notes || '-'}</td>
                        <td className="p-2 hidden md:table-cell">
                          {rsvp.timestamp ? new Date(rsvp.timestamp).toLocaleString() : '-'}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white p-4 sm:p-6 rounded-xl shadow-lg">
        <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-4">Manage Users</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm sm:text-base text-[var(--color-text)]">
            <thead>
              <tr className="bg-[var(--color-primary)]/10">
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left hidden sm:table-cell">Email</th>
                <th className="p-2 text-left">Role</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-[var(--color-text)]/10 hover:bg-[var(--color-background)]">
                  <td className="p-2">{user.name}</td>
                  <td className="p-2 hidden sm:table-cell">{user.email}</td>
                  <td className="p-2 capitalize">{user.role}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleEditUser(user)}
                      className="text-[var(--color-primary)] hover:text-[var(--color-primary)]/80 transition"
                      title="Edit User"
                    >
                      <FaUserEdit />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {editUser && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-white p-4 sm:p-6 rounded-xl shadow-lg max-w-full sm:max-w-md w-full"
          >
            <h3 className="text-lg sm:text-xl font-semibold text-[var(--color-text)] mb-4">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
                  Name *
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={editUser.name}
                  onChange={handleChangeUser}
                  className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
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
                  value={editUser.email}
                  onChange={handleChangeUser}
                  className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
                  required
                />
              </div>
              <div>
                <label htmlFor="role" className="block text-[var(--color-text)] font-medium mb-1 text-sm sm:text-base">
                  Role *
                </label>
                <select
                  id="role"
                  name="role"
                  value={editUser.role}
                  onChange={handleChangeUser}
                  className="w-full p-2 border border-[var(--color-text)]/20 rounded-lg text-[var(--color-text)] focus:ring-[var(--color-primary)] focus:border-[var(--color-primary)] text-sm sm:text-base"
                >
                  <option value="attendee">Attendee</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div className="flex space-x-2">
                <button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition text-sm sm:text-base shadow-md"
                >
                  Save
                </button>
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="flex-1 px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700 transition text-sm sm:text-base shadow-md"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Admin;