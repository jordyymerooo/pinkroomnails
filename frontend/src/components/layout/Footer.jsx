import { Link } from 'react-router-dom';
import { Flower2, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { FaInstagram, FaFacebookF, FaTiktok, FaWhatsapp, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';

export default function Footer() {
  return (
    <footer className="relative overflow-hidden">
      <div className="h-1 w-full gradient-primary" />
      <div className="bg-gradient-to-b from-purple-900 to-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 lg:gap-12">
            {/* Logo y Descripción */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Flower2 className="text-pink-500" size={32} />
                <span className="text-xl sm:text-2xl font-bold font-display">PinkRoom</span>
              </div>
              <p className="text-gray-400 text-xs sm:text-sm leading-relaxed">
                Your premium beauty destination for nail enhancements. We transform your hands into works of art using the best materials and techniques.
              </p>
              <div className="flex gap-3 sm:gap-4 mt-4 sm:mt-6">
                {[
                  { icon: FaInstagram, href: 'https://www.instagram.com/pinkroomnails_by_gissela/', color: 'hover:text-pink-400' },
                  { icon: FaFacebookF, href: 'https://www.facebook.com/profile.php?id=61578283681798&locale=es_LA', color: 'hover:text-blue-400' },
                  { icon: FaTiktok, href: 'https://www.tiktok.com/@gissella97?lang=es', color: 'hover:text-gray-200' },
                ].map((social, i) => (
                  <motion.a key={i} href={social.href} target="_blank" rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, y: -3 }}
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white/10 flex items-center justify-center text-gray-400 ${social.color} transition-colors`}>
                    <social.icon size={16} />
                  </motion.a>
                ))}
              </div>
            </motion.div>

            {/* Enlaces Rápidos */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pink-300">Quick Links</h3>
              <ul className="space-y-2 sm:space-y-3">
                {['Home', 'Services', 'Gallery'].map((link) => (
                  <li key={link}>
                    <a href={`/#${link.toLowerCase()}`} className="text-gray-400 hover:text-pink-300 transition-colors text-xs sm:text-sm flex items-center gap-2">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-pink-500" />
                      {link}
                    </a>
                  </li>
                ))}
                <li>
                  <Link to="/book" className="text-gray-400 hover:text-pink-300 transition-colors text-xs sm:text-sm flex items-center gap-2">
                    <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-pink-500" />
                    Book Appointment
                  </Link>
                </li>
              </ul>
            </motion.div>

            {/* Servicios */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }}>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pink-300">Services</h3>
              <ul className="space-y-2 sm:space-y-3">
                {['Classic Manicure', 'Gel Manicure', 'Acrylic Nails', 'Premium Nail Art', 'Spa Pedicure'].map((s) => (
                  <li key={s}>
                    <span className="text-gray-400 text-xs sm:text-sm flex items-center gap-2">
                      <span className="w-1 h-1 sm:w-1.5 sm:h-1.5 rounded-full bg-purple-400" />
                      {s}
                    </span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* Contacto */}
            <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.3 }}>
              <h3 className="text-base sm:text-lg font-semibold mb-3 sm:mb-4 text-pink-300">Contact Us</h3>
              <ul className="space-y-3 sm:space-y-4">
                <li className="flex items-start gap-2.5 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                  <FaMapMarkerAlt className="text-pink-400 mt-0.5 flex-shrink-0" size={14} />
                  <span>WATERBURY, CT</span>
                </li>
                <li className="flex items-center gap-2.5 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                  <FaPhone className="text-pink-400 flex-shrink-0" size={13} />
                  <span>+1 (203) 414-5441</span>
                </li>
                <li className="flex items-center gap-2.5 sm:gap-3 text-gray-400 text-xs sm:text-sm">
                  <FaEnvelope className="text-pink-400 flex-shrink-0" size={13} />
                  <span>info@glamournails.com</span>
                </li>
              </ul>
              <a href="https://wa.me/573001234567?text=Hi! I would like to book an appointment"
                target="_blank" rel="noopener noreferrer"
                className="mt-4 sm:mt-6 inline-flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 sm:px-5 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium transition-all hover:shadow-lg hover:shadow-green-500/30">
                <FaWhatsapp size={16} /> Message Us
              </a>
            </motion.div>
          </div>

          {/* Bottom */}
          <div className="border-t border-white/10 mt-8 sm:mt-12 pt-6 sm:pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-8">
                <p className="text-gray-500 text-xs sm:text-sm text-center sm:text-left">
                  © {new Date().getFullYear()} PinkRoom. All rights reserved.
                </p>
                <div className="flex gap-4 sm:gap-6">
                  <Link to="/terms" className="text-gray-500 hover:text-pink-300 text-[10px] sm:text-xs transition-colors">Terms of Service</Link>
                  <Link to="/privacy" className="text-gray-500 hover:text-pink-300 text-[10px] sm:text-xs transition-colors">Privacy Policy</Link>
                </div>
              </div>
              <p className="text-gray-600 text-[10px] sm:text-xs flex items-center gap-1 justify-center sm:justify-start">Made with <Heart className="text-pink-500 w-3 h-3" fill="currentColor" /> for PinkRoom</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
