import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../../api/axios';
import { HiArrowLeft, HiArrowRight } from 'react-icons/hi';

export default function GallerySection() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([{ value: 'all', label: 'All' }]);
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    api.get('/gallery').then(res => setImages(res.data)).catch(console.error);
    api.get('/categories').then(res => {
      const dynamicCats = res.data.map(c => ({ value: c.name, label: c.name }));
      setCategories([{ value: 'all', label: 'All' }, ...dynamicCats]);
    }).catch(() => setCategories([{ value: 'all', label: 'All' }]));
  }, []);

  const filtered = activeFilter === 'all' ? images : images.filter(img => img.category === activeFilter);
  
  // Group images into sets of 8 (2 rows x 4 columns)
  const slides = [];
  for (let i = 0; i < filtered.length; i += 8) {
    slides.push(filtered.slice(i, i + 8));
  }

  useEffect(() => {
    if (slides.length <= 1) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 10000);
    return () => clearInterval(interval);
  }, [currentIndex, slides.length]);

  const nextSlide = () => {
    setCurrentIndex(prev => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentIndex(prev => (prev === 0 ? slides.length - 1 : prev - 1));
  };

  return (
    <section id="gallery" className="py-16 sm:py-24 bg-pink-50/30 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
          className="text-center mb-12 flex flex-col items-center">
          <span className="inline-block px-4 py-1.5 rounded-full bg-white text-pink-500 text-xs font-bold tracking-widest uppercase mb-4 shadow-sm">
            📸 Our Portfolio
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold font-display mb-4 w-full text-center">
            Inspiration <span className="text-pink-500">Gallery</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto text-lg text-center">
            A showcase of our finest work and latest trends.
          </p>
        </motion.div>

        {/* Filters */}
        <div className="flex gap-3 mb-12 overflow-x-auto pb-4 justify-center scrollbar-hide px-1 w-full">
          <div className="flex gap-3 mx-auto">
            {categories.map((cat) => (
              <button 
                key={cat.value}
                onClick={() => {
                  setActiveFilter(cat.value);
                  setCurrentIndex(0);
                }}
                className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all whitespace-nowrap ${
                  activeFilter === cat.value ? 'bg-pink-500 text-white shadow-lg shadow-pink-500/30' : 'bg-white text-gray-400 hover:text-pink-500 shadow-sm'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Paginated Grid Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <motion.div 
              className="flex cursor-grab active:cursor-grabbing"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={(e, info) => {
                if (info.offset.x < -50) nextSlide();
                else if (info.offset.x > 50) prevSlide();
              }}
              animate={{ x: `-${currentIndex * 100}%` }}
              transition={{ type: 'spring', stiffness: 100, damping: 20 }}
            >
              {slides.length > 0 ? slides.map((slide, sIndex) => (
                <div key={sIndex} className="w-full flex-shrink-0 px-1">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                    {slide.map((image) => (
                      <motion.div 
                        key={image.id}
                        whileHover={{ y: -5 }}
                        onClick={() => setSelectedImage(image)}
                        className="relative aspect-square rounded-[1.5rem] sm:rounded-[2rem] overflow-hidden cursor-pointer group shadow-lg hover:shadow-xl transition-all border border-white/20"
                      >
                        <img 
                          src={image.full_url || `/storage/${image.image_path}`} 
                          alt={image.title || 'Nail Design'}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-4">
                          <p className="text-white font-bold text-xs sm:text-sm truncate">{image.title || 'Premium Design'}</p>
                          <p className="text-pink-400 text-[8px] sm:text-[10px] font-bold uppercase tracking-widest">{image.category.replace('_', ' ')}</p>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )) : (
                <div className="w-full text-center py-20">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm border border-pink-100">
                      <span className="text-4xl">📸</span>
                    </div>
                    <p className="text-gray-400 text-lg">We will upload designs in this category soon</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>

          {/* Navigation Arrows */}
          {slides.length > 1 && (
            <div className="flex justify-center gap-6 mt-12">
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={prevSlide} className="w-12 h-12 rounded-full bg-white border border-pink-100 flex items-center justify-center text-pink-500 shadow-lg"><HiArrowLeft size={20}/></motion.button>
              <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={nextSlide} className="w-12 h-12 rounded-full bg-white border border-pink-100 flex items-center justify-center text-pink-500 shadow-lg"><HiArrowRight size={20}/></motion.button>
            </div>
          )}
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-12">
            <motion.button className="absolute top-8 right-8 text-white/50 hover:text-white transition-colors">
               <span className="text-4xl">&times;</span>
            </motion.button>
            <motion.img initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.8, opacity: 0 }}
              src={selectedImage.full_url || `/storage/${selectedImage.image_path}`} alt={selectedImage.title || 'Design'}
              className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl" />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
