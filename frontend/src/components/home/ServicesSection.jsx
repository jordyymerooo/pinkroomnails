import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import { HiClock, HiArrowRight, HiArrowLeft, HiSparkles } from 'react-icons/hi';
import api from '../../api/axios';
import { Flower2, Footprints, Gem, Paintbrush, Sparkles, Heart, ChevronLeft, ChevronRight } from 'lucide-react';

const CategoryIcon = ({ category, className }) => {
  const props = { className: className || "w-12 h-12 sm:w-16 sm:h-16 text-white" };
  switch(category.toLowerCase()) {
    case 'manicure': return <Flower2 {...props} />;
    case 'pedicure': return <Footprints {...props} />;
    case 'acrylics': case 'uñas acrílicas': return <Gem {...props} />;
    case 'nail_art': case 'diseño': return <Paintbrush {...props} />;
    case 'press_on': return <Sparkles {...props} />;
    default: return <Heart {...props} />;
  }
};

export default function ServicesSection() {
  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsToShow, setItemsToShow] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    api.get('/services').then(res => setServices(res.data)).catch(console.error);
  }, []);

  const groupedServices = services
    .filter(s => s.category && s.category.toLowerCase() !== 'add-ons' && s.category.toLowerCase() !== 'add_ons')
    .reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {});

  const categories = Object.entries(groupedServices);

  useEffect(() => {
    const handleResize = () => {
      setItemsToShow(window.innerWidth >= 1024 ? 3 : window.innerWidth >= 640 ? 2 : 1);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (categories.length <= itemsToShow || selectedCategory) return;
    const interval = setInterval(() => {
      nextSlide();
    }, 7000);
    return () => clearInterval(interval);
  }, [currentIndex, itemsToShow, categories.length, selectedCategory]);

  const nextSlide = () => {
    if (categories.length <= itemsToShow) return;
    setCurrentIndex(prev => (prev + 1) % (categories.length - itemsToShow + 1));
  };

  const prevSlide = () => {
    if (categories.length <= itemsToShow) return;
    setCurrentIndex(prev => (prev === 0 ? categories.length - itemsToShow : prev - 1));
  };

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16"
        >
          <span className="inline-block px-4 py-1.5 rounded-full bg-pink-50 text-pink-500 text-xs font-bold tracking-widest uppercase mb-4">
             Our Services
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-4">
            Discover our <span className="text-pink-500">Premium Range</span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-sm sm:text-base">
            Everything you need to make your hands and feet shine. Select a category to see more.
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {selectedCategory ? (
            /* LIST OF SERVICES IN SELECTED CATEGORY */
            <motion.div
              key="services-list"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-8"
            >
              <button 
                onClick={() => setSelectedCategory(null)} 
                className="flex items-center gap-2 text-pink-500 hover:text-pink-600 font-bold transition-colors mb-6"
              >
                <HiArrowLeft /> Back to Categories
              </button>
              
              <div className="flex items-center gap-4 mb-8">
                <div className="p-3 bg-pink-500 rounded-2xl shadow-lg">
                  <CategoryIcon category={selectedCategory} className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize">
                  {selectedCategory.replace('_', ' ')}
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {groupedServices[selectedCategory]?.map((service, i) => (
                  <motion.div
                    key={service.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 }}
                    whileHover={{ y: -5 }}
                    className="bg-white rounded-3xl overflow-hidden shadow-xl border border-gray-100 flex flex-col cursor-pointer"
                    onClick={() => navigate(`/book?service=${service.id}`)}
                  >
                    <div className="aspect-video relative overflow-hidden">
                      {service.image ? (
                        <img 
                          src={service.image_url || `/storage/${service.image}`} 
                          alt={service.name}
                          className="w-full h-full object-cover" 
                        />
                      ) : (
                        <div className="w-full h-full bg-pink-50 flex items-center justify-center">
                          <CategoryIcon category={selectedCategory} className="w-12 h-12 text-pink-200" />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full font-bold text-pink-500 shadow-md">
                        ${parseFloat(service.price).toFixed(0)}
                      </div>
                    </div>
                    <div className="p-6 flex flex-col flex-grow">
                      <h4 className="text-xl font-bold text-gray-900 mb-2">{service.name}</h4>
                      <p className="text-gray-500 text-sm mb-4 line-clamp-2">{service.description}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                          <HiClock /> {service.duration_minutes} min
                        </span>
                        <div className="w-8 h-8 rounded-full bg-pink-500 text-white flex items-center justify-center">
                          <HiArrowRight size={14} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ) : (
            /* CATEGORY CAROUSEL */
            <motion.div
              key="category-carousel"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <div className="relative">
                <div className="overflow-hidden px-2 py-4">
                  <motion.div 
                    className="flex cursor-grab active:cursor-grabbing"
                    drag="x"
                    dragConstraints={{ left: 0, right: 0 }}
                    onDragEnd={(e, info) => {
                      if (info.offset.x < -50) nextSlide();
                      else if (info.offset.x > 50) prevSlide();
                    }}
                    animate={{ x: `calc(-${currentIndex * (100 / itemsToShow)}%)` }}
                    transition={{ type: 'spring', stiffness: 200, damping: 25 }}
                  >
                    {categories.map(([category, items]) => (
                      <div key={category} className={`w-full sm:w-1/2 lg:w-1/3 flex-shrink-0 px-3 sm:px-4`}>
                        <motion.div 
                          whileHover={{ y: -8 }}
                          onClick={() => setSelectedCategory(category)}
                          className="bg-white rounded-[2.5rem] p-8 sm:p-10 text-center cursor-pointer shadow-xl hover:shadow-2xl transition-all border border-gray-50 h-full flex flex-col items-center justify-center group relative overflow-hidden"
                        >
                          <div className="absolute top-0 left-0 w-full h-1.5 gradient-primary" />
                          <div className="w-24 h-24 mx-auto rounded-full gradient-primary flex items-center justify-center mb-6 shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                            <CategoryIcon category={category} />
                          </div>
                          <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 capitalize mb-2">
                            {category.replace('_', ' ')}
                          </h3>
                          <p className="text-gray-400 text-sm mb-6">{items.length} Services available</p>
                          <span className="text-pink-500 font-bold text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                            View Services <HiArrowRight />
                          </span>
                        </motion.div>
                      </div>
                    ))}
                  </motion.div>
                </div>

                {/* Arrows */}
                {categories.length > itemsToShow && (
                  <div className="flex justify-center gap-4 mt-8">
                    <button onClick={prevSlide} className="w-12 h-12 rounded-full bg-white border-2 border-pink-100 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all shadow-md">
                      <HiArrowLeft size={20} />
                    </button>
                    <button onClick={nextSlide} className="w-12 h-12 rounded-full bg-white border-2 border-pink-100 flex items-center justify-center text-pink-500 hover:bg-pink-500 hover:text-white hover:border-pink-500 transition-all shadow-md">
                      <HiArrowRight size={20} />
                    </button>
                  </div>
                )}
              </div>

              {/* Bottom CTA Button */}
              <div className="text-center mt-12">
                 <Link to="/book">
                   <motion.button
                     whileHover={{ scale: 1.05 }}
                     whileTap={{ scale: 0.95 }}
                     className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-10 py-4 rounded-full font-bold text-lg shadow-xl shadow-pink-500/20 flex items-center gap-2 mx-auto"
                   >
                     Book Appointment <HiSparkles />
                   </motion.button>
                 </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
