import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { HiSparkles } from 'react-icons/hi';
import { Flower2, Sparkles, Heart, Gem, Star } from 'lucide-react';

export default function HeroBanner() {
  return (
    <section className="relative min-h-[100dvh] flex items-center overflow-hidden gradient-hero">
      {/* Elementos decorativos - ocultos en móvil para rendimiento */}
      <motion.div
        className="absolute top-20 right-10 w-48 md:w-72 h-48 md:h-72 rounded-full opacity-10 hidden sm:block"
        style={{ background: 'radial-gradient(circle, #E91E8C, transparent)' }}
        animate={{ scale: [1, 1.2, 1], x: [0, 20, 0] }}
        transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="absolute bottom-32 left-10 w-40 md:w-56 h-40 md:h-56 rounded-full opacity-10 hidden sm:block"
        style={{ background: 'radial-gradient(circle, #00BCD4, transparent)' }}
        animate={{ scale: [1.2, 1, 1.2], y: [0, -20, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 sm:py-28 lg:py-32 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center relative z-10 w-full">
        {/* Texto */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="inline-flex items-center gap-2 glass-pink rounded-full px-4 sm:px-5 py-2 mb-4 sm:mb-6"
          >
            <HiSparkles className="text-pink-500" />
            <span className="text-pink-600 text-xs sm:text-sm font-medium">Premium Nail Enhancements</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold font-display leading-[1.1] mb-4 sm:mb-6"
          >
            <span className="text-gray-900">Your nails,</span>
            <br />
            <span className="gradient-text">our</span>
            <br />
            <span className="gradient-text">passion</span>
            <motion.span
              className="inline-block ml-2 sm:ml-3"
              animate={{ rotate: [0, 15, -10, 0] }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            >
              <Flower2 className="inline-block text-pink-500 w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12" />
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="text-gray-500 text-sm sm:text-base lg:text-lg leading-relaxed mb-6 sm:mb-8 max-w-lg mx-auto lg:mx-0"
          >
            We transform your hands into works of art. Discover premium manicure, 
            pedicure, and nail art services using the finest materials and latest trends.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.45 }}
            className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center lg:justify-start"
          >
            <Link to="/book">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-primary text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 w-full sm:w-auto justify-center"
              >
                <HiSparkles />
                Book Now
              </motion.button>
            </Link>
            <a href="#services">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-outline text-sm sm:text-base py-3 sm:py-3.5 px-6 sm:px-8 w-full sm:w-auto justify-center"
              >
                View Services
              </motion.button>
            </a>
          </motion.div>

        </div>

        {/* Visual decorativo derecho */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="hidden lg:flex justify-center items-center relative"
        >
          <div className="relative w-72 xl:w-96 h-72 xl:h-96">
            <motion.div
              className="absolute inset-0 rounded-full"
              style={{ background: 'linear-gradient(135deg, rgba(255,61,168,0.15), rgba(0,188,212,0.15))' }}
              animate={{ rotate: 360 }}
              transition={{ duration: 30, repeat: Infinity, ease: 'linear' }}
            />
            <motion.div
              className="absolute inset-6 rounded-full"
              style={{ background: 'linear-gradient(225deg, rgba(255,61,168,0.1), rgba(0,188,212,0.2))' }}
              animate={{ rotate: -360 }}
              transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            />
            <div className="absolute inset-12 rounded-full bg-white/50 backdrop-blur-sm flex items-center justify-center">
              <motion.span
                animate={{ y: [0, -10, 0], rotate: [0, 5, -5, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
              >
                <Flower2 className="text-pink-500 w-16 h-16 xl:w-20 xl:h-20" />
              </motion.span>
            </div>

            {[
              <Sparkles className="w-6 h-6 text-yellow-400" />,
              <Heart className="w-6 h-6 text-pink-400" />,
              <Flower2 className="w-6 h-6 text-pink-300" />,
              <Gem className="w-6 h-6 text-cyan-400" />
            ].map((Icon, i) => (
              <motion.span
                key={i}
                className="absolute"
                style={{
                  top: `${[10, 20, 70, 80][i]}%`,
                  left: `${[85, 5, 90, 0][i]}%`,
                }}
                animate={{ y: [0, -15, 0], opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, delay: i * 0.5, repeat: Infinity, ease: 'easeInOut' }}
              >
                {Icon}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Wave bottom */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
          <path d="M0,60 C360,100 720,20 1080,60 C1260,80 1380,70 1440,60 L1440,100 L0,100 Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}
