import { motion } from 'framer-motion';
import { FaUsers, FaCalendarAlt, FaMapMarkerAlt } from 'react-icons/fa';

const About = () => (
  <motion.section
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.8 }}
    viewport={{ once: true }}
    className="py-12 sm:py-16 md:py-20 bg-white"
  >
    <div className="container mx-auto px-4">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">
          About Eventure
        </h2>
        <p className="text-lg sm:text-xl text-[var(--color-text)] mb-8 leading-relaxed">
          Eventure is your gateway to discovering and participating in exciting campus events. 
          We connect students, faculty, and staff through a seamless event management platform 
          that makes it easy to find, RSVP to, and organize memorable experiences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-[var(--color-primary)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUsers className="text-2xl text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
              Community Driven
            </h3>
            <p className="text-[var(--color-text)]/80">
              Built by students, for students. Connect with your campus community 
              and discover events that match your interests.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-[var(--color-accent)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaCalendarAlt className="text-2xl text-[var(--color-accent)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
              Easy Event Management
            </h3>
            <p className="text-[var(--color-text)]/80">
              Simple RSVP system with real-time updates. Never miss out on 
              events you care about with our notification system.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="text-center"
          >
            <div className="bg-[var(--color-primary)]/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaMapMarkerAlt className="text-2xl text-[var(--color-primary)]" />
            </div>
            <h3 className="text-xl font-semibold text-[var(--color-text)] mb-2">
              Campus Wide
            </h3>
            <p className="text-[var(--color-text)]/80">
              From academic conferences to social gatherings, discover events 
              happening across all campus locations and departments.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
          className="mt-12 p-6 bg-[var(--color-background)] rounded-xl"
        >
          <h3 className="text-2xl font-semibold text-[var(--color-primary)] mb-4">
            Our Mission
          </h3>
          <p className="text-[var(--color-text)] text-lg leading-relaxed">
            To foster a vibrant campus community by making event discovery and participation 
            effortless. We believe that great experiences bring people together, and our platform 
            is designed to help you find your tribe and create lasting memories.
          </p>
        </motion.div>
      </div>
    </div>
  </motion.section>
);

export default About;