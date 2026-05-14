import { FaWhatsapp } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useLocation } from 'react-router-dom';

export default function WhatsAppButton() {
  const location = useLocation();
  const number = '12034145441';
  const message = encodeURIComponent('Hi! I would like to book an appointment at PinkRoom');

  // Hide button on booking page to avoid overlapping buttons
  if (location.pathname === '/book') return null;

  return (
    <motion.a href={`https://wa.me/${number}?text=${message}`} target="_blank" rel="noopener noreferrer"
      className="whatsapp-float fixed z-[9999] flex items-center justify-center" 
      whileHover={{ scale: 1.15 }} whileTap={{ scale: 0.9 }}
      initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: 0.5, type: 'spring' }}>
      <FaWhatsapp size={30} />
    </motion.a>
  );
}

