import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiMenu, HiX } from 'react-icons/hi';
import { Flower2, Sparkles } from 'lucide-react';

const navLinks = [
  { name: 'Home', path: '/' },
  { name: 'Services', path: '/#services' },
  { name: 'Gallery', path: '/#gallery' }
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileOpen(false);
  }, [location]);

  // Bloquear scroll cuando el menú mobile está abierto
  useEffect(() => {
    document.body.style.overflow = isMobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [isMobileOpen]);

  const handleNavClick = (e, path) => {
    if (path.startsWith('/#')) {
      e.preventDefault();
      setIsMobileOpen(false);
      const id = path.replace('/#', '');
      if (location.pathname !== '/') {
        window.location.href = path;
      } else {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <>
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled || location.pathname === '/book'
            ? 'py-2 sm:py-3 bg-white/95 backdrop-blur-xl shadow-lg shadow-pink-500/5'
            : 'py-3 sm:py-5 bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <motion.span whileHover={{ rotate: 15 }} className="text-pink-500">
              <Flower2 size={28} />
            </motion.span>
            <span className="text-lg sm:text-xl font-bold gradient-text font-display">
              PinkRoom
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center gap-6 xl:gap-8">
            {navLinks.map((link) => (
              <a
                key={link.path}
                href={link.path}
                onClick={(e) => handleNavClick(e, link.path)}
                className="text-sm font-medium text-gray-600 hover:text-pink-500 transition-colors duration-300 relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-300 group-hover:w-full" />
              </a>
            ))}
            <Link to="/book">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-sm py-2.5 px-6"
              >
                <Sparkles className="inline-block w-4 h-4 mr-1" /> Book Appointment
              </motion.button>
            </Link>
          </div>

          {/* Mobile Toggle */}
          <button
            onClick={() => setIsMobileOpen(!isMobileOpen)}
            className="lg:hidden p-2 text-pink-500 hover:text-pink-600 transition-colors"
            aria-label="Menú"
          >
            {isMobileOpen ? <HiX size={26} /> : <HiMenu size={26} />}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 lg:hidden"
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
            
            {/* Panel */}
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 h-full w-[280px] sm:w-[320px] bg-white/95 backdrop-blur-xl shadow-2xl"
            >
              {/* Close button area */}
              <div className="flex justify-end p-5">
                <button onClick={() => setIsMobileOpen(false)} className="p-2 text-gray-400 hover:text-pink-500">
                  <HiX size={24} />
                </button>
              </div>

              {/* Mobile Logo */}
              <div className="px-8 pb-6 border-b border-pink-100">
                <div className="flex items-center gap-2">
                  <Flower2 className="text-pink-500" size={28} />
                  <span className="text-xl font-bold gradient-text font-display">PinkRoom</span>
                </div>
              </div>

              {/* Links */}
              <div className="flex flex-col px-6 py-6 gap-1">
                {navLinks.map((link, i) => (
                  <motion.a
                    key={link.path}
                    href={link.path}
                    onClick={(e) => handleNavClick(e, link.path)}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.08 }}
                    className="text-base font-medium text-gray-700 hover:text-pink-500 hover:bg-pink-50 transition-all py-3 px-4 rounded-xl"
                  >
                    {link.name}
                  </motion.a>
                ))}
              </div>

              {/* CTA */}
              <div className="px-6 mt-4">
                <Link to="/book" onClick={() => setIsMobileOpen(false)}>
                  <motion.button
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.35 }}
                    className="btn-primary w-full text-center justify-center py-3.5"
                  >
                    <Sparkles className="inline-block w-5 h-5 mr-1" /> Book Appointment
                  </motion.button>
                </Link>
              </div>

              {/* Contact info mobile */}
              <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-pink-50">
                <p className="text-xs text-gray-400 text-center">📞 +57 300 123 4567</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
