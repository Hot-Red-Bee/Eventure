import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  FaPlus, 
  FaEdit, 
  FaTrash, 
  FaUsers, 
  FaFilter, 
  FaTimes, 
  FaUserEdit, 
  FaArrowLeft,
  FaBars,
  FaSignOutAlt,
  FaBan,
  FaCheckCircle
 } from 'react-icons/fa';

// ...existing code...
// Mock user and data (replace with API calls to /users, /events, /rsvps, /categories)
const mockUser = { id: 1, name: 'John Doe', role: 'admin', email: 'john@example.com' };
const mockUsers = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'attendee' },
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
    location: { id: 1, name: 'Main Hall' },
    category: { id: 1, name: 'Tech' },
    organizerId: 1,
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
    status: 'draft',
    bannerImage: '/assets/images/banner.jpg',
    location: { id: 2, name: 'Outdoor Quad' },
    category: { id: 2, name: 'Music' },
    organizerId: 1,
    rsvpCount: 0,
  },
];
const mockRSVPs = [
  { id: 1, userId: 2, eventId: 1, status: 'confirmed', waitlist: false, notes: 'Needs wheelchair access', timestamp: '2025-09-01T10:00:00Z' },
  { id: 2, userId: 3, eventId: 1, status: 'confirmed', waitlist: false, notes: '', timestamp: '2025-09-02T12:00:00Z' },
];
const mockCategories = [
  { id: 1, name: 'Tech' },
  { id: 2, name: 'Music' },
];
// ...existing code...

const Admin = () => {
  const navigate = useNavigate();
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [categoryId, setCategoryId] = useState('');
  const [date, setDate] = useState('');
  const [filteredEvents, setFilteredEvents] = useState(mockEvents);
  const [users, setUsers] = useState(mockUsers);
  const [editUser, setEditUser] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    let result = mockEvents;
    if (categoryId) {
      result = result.filter((event) => event.category.id === parseInt(categoryId));
    }
    if (date) {
      result = result.filter((event) => new Date(event.date) >= new Date(date));
    }
    setFilteredEvents(result);
  }, [categoryId, date]);

  const handleClearFilters = () => {
    setCategoryId('');
    setDate('');
    setFilteredEvents(mockEvents);
  };

  const handleDelete = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      // Mock DELETE /events/:id
      console.log(`Deleting event ${eventId}`);
      navigate('/admin');
    }
  };

  const handleViewRSVPs = (eventId) => {
    setSelectedEventId(eventId === selectedEventId ? null : eventId);
  };

  const handleEditUser = (user) => {
    setEditUser({ ...user });
  };

  const handleUpdateUser = (e) => {
    e.preventDefault();
    if (!editUser.name || !editUser.email) {
      setError('Please fill out all fields.');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(editUser.email)) {
      setError('Please enter a valid email address.');
      return;
    }
    // Mock PUT /users/:id
    setUsers(users.map((u) => (u.id === editUser.id ? editUser : u)));
    setSuccess('User updated successfully!');
    setEditUser(null);
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleChangeUser = (e) => {
    const { name, value } = e.target;
    setEditUser({ ...editUser, [name]: value });
  };

  const handleLogout = () => {
    // placeholder logout — replace with real logic
    navigate('/login');
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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto py-6 sm:py-8 bg-[var(--color-background)] px-4"
    >
      {/* Back button */}
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

      {/* Layout with always-visible sidebar (no toggle) */}
      <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
        <aside className="md:col-span-1 bg-white p-4 rounded-xl shadow h-fit">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-[var(--color-primary)] flex items-center justify-center text-white">
              <FaUsers />
            </div>
            <div>
              <p className="font-semibold text-[var(--color-text)]">{mockUser.name}</p>
              <p className="text-sm text-[var(--color-text)]/70">{mockUser.email || ''}</p>
            </div>
          </div>

          <nav className="space-y-2">
            <Link
              to="/profile"
              className="block px-3 py-2 rounded hover:bg-[var(--color-primary)]/5 text-[var(--color-text)]"
            >
              Profile
            </Link>

            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded hover:bg-red-50 text-[var(--color-text)] flex items-center"
            >
              <FaSignOutAlt className="mr-2 text-[var(--color-primary)]" /> Logout
            </button>
          </nav>
        </aside>

        <main className="md:col-span-5">
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

          {/* Filters, Manage Events, RSVPs, Manage Users, Edit modal - existing content unchanged */}
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
                      <td className="p-2 hidden sm:table-cell">{new Date(event.date).toLocaleDateString()}</td>
                      <td className="p-2 hidden md:table-cell">{event.location.name}</td>
                      <td className="p-2 capitalize">
                        <span className={event.status === 'published' ? 'text-[var(--color-accent)]' : 'text-red-600'}>
                          {event.status}
                        </span>
                      </td>
                      <td className="p-2">{event.seatLimit - (event.rsvpCount || 0)}/{event.seatLimit}</td>
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
                  RSVPs for {mockEvents.find((e) => e.id === selectedEventId)?.title}
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
                      {mockRSVPs
                        .filter((rsvp) => rsvp.eventId === selectedEventId)
                        .map((rsvp) => (
                          <tr key={rsvp.id} className="border-b border-[var(--color-text)]/10 hover:bg-[var(--color-background)]">
                            <td className="p-2">{rsvp.userId}</td>
                            <td className="p-2 capitalize">
                              <span className={rsvp.status === 'confirmed' ? 'text-[var(--color-accent)]' : 'text-red-600'}>
                                {rsvp.status}
                              </span>
                            </td>
                            <td className="p-2 hidden sm:table-cell">{rsvp.notes || '-'}</td>
                            <td className="p-2 hidden md:table-cell">
                              {new Date(rsvp.timestamp).toLocaleString()}
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
        </main>
      </div>
    </motion.div>
  );
};
export default Admin;