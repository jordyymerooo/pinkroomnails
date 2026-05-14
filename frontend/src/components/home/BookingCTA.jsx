import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { Flower2 } from 'lucide-react';
import { HiSparkles } from 'react-icons/hi';

export default function BookingCTA() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 relative overflow-hidden flex flex-col items-center justify-center">
      <div className="absolute inset-0 gradient-primary opacity-95" />
      <motion.div className="absolute top-10 left-10 w-28 sm:w-40 h-28 sm:h-40 rounded-full bg-white/10" animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 5, repeat: Infinity }} />
      <motion.div className="absolute bottom-10 right-10 w-40 sm:w-60 h-40 sm:h-60 rounded-full bg-white/5" animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 7, repeat: Infinity }} />
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 flex flex-col items-center text-center relative z-10 min-h-[300px]">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="mb-6 flex justify-center w-full">
          <Flower2 className="text-white w-12 h-12 sm:w-16 sm:h-16" />
        </motion.div>
        
        <motion.h2 initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-3xl sm:text-4xl md:text-5xl font-bold font-display text-white mb-6 leading-tight w-full text-center mx-auto">
          Ready for stunning nail enhancements?
        </motion.h2>
        
        <motion.p initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.1 }}
          className="text-white/80 text-base sm:text-lg mb-10 max-w-2xl mx-auto px-4 w-full text-center">
          Book your appointment now and let our experts pamper you. Your premium experience awaits.
        </motion.p>
        
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: 0.2 }} className="w-full flex justify-center mt-4">
          <Link to="/book" className="inline-block">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              className="bg-white text-pink-600 px-8 py-4 rounded-full font-bold text-base lg:text-lg shadow-2xl shadow-black/20 hover:shadow-3xl transition-all flex items-center justify-center gap-3 mx-auto">
              <HiSparkles className="text-xl" /> Book My Appointment
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
