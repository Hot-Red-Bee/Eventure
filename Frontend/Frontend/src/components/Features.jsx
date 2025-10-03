import { motion } from 'framer-motion';
import { FaSearch, FaBell, FaUserShield, FaMobile, FaChartBar, FaHeart } from 'react-icons/fa';

const Features = () => {
  const features = [
    {
      icon: FaSearch,
      title: 'Smart Event Discovery',
      description: 'Advanced filtering and search capabilities to find events that match your interests, schedule, and location preferences.',
      color: 'var(--color-primary)',
    },
    {
      icon: FaBell,
      title: 'Real-time Notifications',
      description: 'Stay updated with instant notifications about event changes, reminders, and new events in your favorite categories.',
      color: 'var(--color-accent)',
    },
    {
      icon: FaUserShield,
      title: 'Role-based Access',
      description: 'Secure admin panel for event organizers with comprehensive user management and event analytics.',
      color: 'var(--color-primary)',
    },
    {
      icon: FaMobile,
      title: 'Mobile Responsive',
      description: 'Seamless experience across all devices. RSVP to events, check schedules, and get updates on the go.',
      color: 'var(--color-accent)',
    },
    {
      icon: FaChartBar,
      title: 'Event Analytics',
      description: 'Detailed insights for event organizers including attendance tracking, popular events, and user engagement metrics.',
      color: 'var(--color-primary)',
    },
    {
      icon: FaHeart,
      title: 'Personalized Experience',
      description: 'Customized event recommendations based on your RSVP history, interests, and campus involvement.',
      color: 'var(--color-accent)',
    },
  ];

  return (
    <motion.section
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      viewport={{ once: true }}
      className="py-12 sm:py-16 md:py-20 bg-[var(--color-background)]"
    >
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-[var(--color-primary)] mb-6">
              Powerful Features
            </h2>
            <p className="text-lg sm:text-xl text-[var(--color-text)] max-w-3xl mx-auto">
              Everything you need to discover, organize, and participate in campus events. 
              Built with modern technology and designed for the best user experience.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                whileHover={{ y: -5 }}
                className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                <div 
                  className="w-12 h-12 rounded-lg flex items-center justify-center mb-4"
                  style={{ backgroundColor: `${feature.color}15` }}
                >
                  <feature.icon 
                    className="text-2xl" 
                    style={{ color: feature.color }}
                  />
                </div>
                <h3 className="text-xl font-semibold text-[var(--color-text)] mb-3">
                  {feature.title}
                </h3>
                <p className="text-[var(--color-text)]/80 leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16 text-center"
          >
            <div className="bg-gradient-to-r from-[var(--color-primary)] to-[var(--color-accent)] p-8 rounded-xl text-white">
              <h3 className="text-2xl sm:text-3xl font-bold mb-4">
                Ready to Get Started?
              </h3>
              <p className="text-lg mb-6 opacity-90">
                Join thousands of students already using Eventure to discover amazing campus events.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <motion.a
                  href="/signup"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-[var(--color-primary)] rounded-xl font-semibold hover:bg-gray-100 transition-colors"
                >
                  Sign Up Now
                </motion.a>
                <motion.a
                  href="/events"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-[var(--color-primary)] transition-colors"
                >
                  Browse Events
                </motion.a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.section>
  );
};

export default Features;