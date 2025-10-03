
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCalendarAlt, FaMapMarkerAlt, FaClock } from 'react-icons/fa';

// Props match Event entity from ERD
const EventCard = ({ event }) => {
  const { id, title, description, date, startTime, endTime, seatLimit, status, bannerImage, location } = event;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--color-background)] rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow"
    >
      <img
        src={bannerImage || '/assets/images/banner.jpeg'}
        alt={title}
        className="w-full h-32 sm:h-40 md:h-48 object-cover"
      />
      <div className="p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-bold text-[var(--color-primary)] mb-2">{title}</h3>
        <p className="text-[var(--color-text)] mb-4 line-clamp-2 text-sm sm:text-base">{description}</p>
        <div className="space-y-2 text-xs sm:text-sm text-[var(--color-text)]">
          <div className="flex items-center">
            <FaCalendarAlt className="mr-2 text-[var(--color-accent)]" />
            <span>{new Date(date).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center">
            <FaClock className="mr-2 text-[var(--color-accent)]" />
            <span>{`${startTime} - ${endTime}`}</span>
          </div>
          <div className="flex items-center">
            <FaMapMarkerAlt className="mr-2 text-[var(--color-accent)]" />
            <span>{location.name}</span>
          </div>
          <div>
            <span>Seats: {seatLimit - (event.rsvpCount || 0)} / {seatLimit}</span>
          </div>
          <div>
            <span className={`capitalize ${status === 'published' ? 'text-[var(--color-accent)]' : 'text-red-600'}`}>
              {status}
            </span>
          </div>
        </div>
        <Link
          to={`/rsvp?eventId=${id}`}
          className={`mt-4 inline-block px-4 py-2 rounded-xl text-white text-sm sm:text-base transition ${
            status === 'published' ? 'bg-[var(--color-primary)] hover:bg-[var(--color-primary)]/80' : 'bg-gray-400 cursor-not-allowed'
          }`}
          disabled={status !== 'published'}
        >
          RSVP
        </Link>
      </div>
    </motion.div>
  );
};

export default EventCard;