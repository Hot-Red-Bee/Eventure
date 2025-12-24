
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';


// Mock user (replace with auth context or src/utils/auth.js)
const mockUser = { id: 1, name: 'John Doe', role: 'admin' };

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    // Mock logout (replace with src/utils/auth.js logout, e.g., clear JWT)
    console.log('Logging out');
    navigate('/login');
  };

  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-[var(--color-primary)] text-white p-4 shadow-lg"
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-lg sm:text-xl font-bold">
          Eventure
        </Link>
        <div className="hidden sm:flex space-x-4">
          {!mockUser && (
            <>
              <Link to="/login" 
              className="hover:text-[var(--color-accent)] transition text-sm sm:text-base">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-[var(--color-accent)] text-white rounded-xl hover:bg-[var(--color-accent)]/80 transition text-sm sm:text-base">
                Sign Up
              </Link>
            </>
          )}
        </div>
        
      </div>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          transition={{ duration: 0.3 }}
          className="sm:hidden mt-4 space-y-2"
        >
         
          {!mockUser && (
            <>
              <Link
                to="/login"
                className="block py-2 hover:text-[var(--color-accent)] transition text-sm sm:text-base"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup" 
                className="block py-2 hover:text-[var(--color-accent)] transition text-sm sm:text-base"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </motion.div>
      )}
    </motion.nav>
  );
};

export default Navbar;