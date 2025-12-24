
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { FaCalendarAlt } from 'react-icons/fa';

const Hero = () => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    className="bg-gradient-to-r from-[var(--color-background)] to-white py-8 sm:py-12 md:py-16 text-center"
  >
    <div className="container mx-auto px-4">
      <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-4">
        Welcome to Eventure
      </h1>
      <p className="text-base sm:text-lg text-[var(--color-text)] mb-6 max-w-2xl mx-auto">
        Discover and RSVP to exciting campus events!
      </p>
      <Link
        to="/events"
        className="inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 bg-[var(--color-primary)] text-white rounded-xl hover:bg-[var(--color-primary)]/80 transition shadow-md"
      >
        <FaCalendarAlt className="mr-2" />
        Explore Events
      </Link>
    </div>
  </motion.div>
);

export default Hero;