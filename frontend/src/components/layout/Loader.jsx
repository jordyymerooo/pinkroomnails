import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function Loader() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #FFF0F7 0%, #FFD6EE 50%, #B2EBF2 100%)' }}
        >
          {/* Elementos decorativos de fondo */}
          <motion.div
            className="absolute w-64 h-64 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #E91E8C, transparent)', top: '15%', left: '10%' }}
            animate={{ scale: [1, 1.3, 1], opacity: [0.1, 0.25, 0.1] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
          <motion.div
            className="absolute w-48 h-48 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #00BCD4, transparent)', bottom: '20%', right: '15%' }}
            animate={{ scale: [1.2, 1, 1.2], opacity: [0.15, 0.3, 0.15] }}
            transition={{ duration: 2.5, repeat: Infinity }}
          />

          {/* Icono de uña animado */}
          <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
            className="relative mb-8"
          >
            <div className="loader-nail" />
            <motion.span
              className="absolute -top-4 -right-4 text-2xl"
              animate={{ rotate: [0, 20, -20, 0], scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Sparkles className="text-pink-500 w-6 h-6" />
            </motion.span>
          </motion.div>

          {/* Nombre del salón */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl font-bold gradient-text font-display mb-3"
          >
            PinkRoom
          </motion.h1>

          {/* Barra de progreso */}
          <motion.div className="w-48 h-1 bg-pink-200 rounded-full overflow-hidden mt-4">
            <motion.div
              className="h-full gradient-primary rounded-full"
              initial={{ width: '0%' }}
              animate={{ width: '100%' }}
              transition={{ duration: 1.8, ease: 'easeInOut' }}
            />
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            className="text-pink-400 text-sm mt-4 font-medium"
          >
            Preparando tu experiencia...
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
