import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';
import { HiCheck, HiArrowLeft, HiArrowRight, HiCalendar, HiClock, HiUser, HiPhone, HiMail } from 'react-icons/hi';
import { Flower2, Sparkles } from 'lucide-react';
import { format, addDays, startOfToday } from 'date-fns';
import { enUS } from 'date-fns/locale';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const steps = ['Service', 'Add-ons', 'Date/Time', 'Details', 'Confirm'];

export default function BookingPage() {
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(0);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);
  const [selectedAddons, setSelectedAddons] = useState([]);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [availableSlots, setAvailableSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [formData, setFormData] = useState({ client_name: '', client_phone: '', client_email: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);

  // Scroll to top on load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Generar próximos 14 días
  const dates = Array.from({ length: 14 }, (_, i) => addDays(startOfToday(), i));

  useEffect(() => {
    api.get('/services').then(res => {
      setServices(res.data);
      const preSelected = searchParams.get('service');
      if (preSelected) {
        const found = res.data.find(s => s.id === parseInt(preSelected));
        if (found) { setSelectedService(found); setCurrentStep(1); }
      }
    });
  }, [searchParams]);

  useEffect(() => {
    if (selectedDate) {
      setLoadingSlots(true);
      setSelectedTime(null);
      const serviceId = selectedService ? selectedService.id : '';
      api.get(`/available-slots?date=${format(selectedDate, 'yyyy-MM-dd')}&service_id=${serviceId}`)
        .then(res => setAvailableSlots(res.data.slots || []))
        .catch(() => setAvailableSlots([]))
        .finally(() => setLoadingSlots(false));
    }
  }, [selectedDate]);

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      const addonsText = selectedAddons.length > 0 
        ? `\n\nSelected Add-ons:\n` + selectedAddons.map(a => `- ${a.name} (+$${parseFloat(a.price).toFixed(2)})`).join('\n')
        : '';
      const finalNotes = formData.notes + addonsText;

      await api.post('/appointments', {
        service_id: selectedService.id,
        appointment_date: format(selectedDate, 'yyyy-MM-dd'),
        appointment_time: selectedTime,
        client_name: formData.client_name,
        client_phone: formData.client_phone,
        client_email: formData.client_email,
        notes: finalNotes.trim(),
      });
      setBookingComplete(true);
      toast.success('Appointment booked successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error booking. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const canAdvance = () => {
    if (currentStep === 0) return selectedService;
    if (currentStep === 1) return true; // Add-ons are optional
    if (currentStep === 2) return selectedDate && selectedTime;
    if (currentStep === 3) return formData.client_name && formData.client_phone;
    return true;
  };

  const groupedServices = services
    .filter(s => s.category && s.category.toLowerCase() !== 'add-ons' && s.category.toLowerCase() !== 'add_ons')
    .reduce((acc, curr) => {
      if (!acc[curr.category]) acc[curr.category] = [];
      acc[curr.category].push(curr);
      return acc;
    }, {});
    
  const addons = services.filter(s => s.category && (s.category.toLowerCase() === 'add-ons' || s.category.toLowerCase() === 'add_ons'));

  if (bookingComplete) {
    return (
      <div className="min-h-[100dvh] gradient-hero flex items-center justify-center pt-20 px-4">
        <motion.div initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white rounded-2xl sm:rounded-3xl p-6 sm:p-10 lg:p-12 max-w-md w-full text-center shadow-2xl shadow-pink-500/10">
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.2, type: 'spring' }} className="w-16 h-16 sm:w-20 sm:h-20 rounded-full gradient-primary mx-auto flex items-center justify-center mb-4 sm:mb-6">
            <HiCheck className="text-white text-2xl sm:text-3xl" />
          </motion.div>
          <h2 className="text-xl sm:text-2xl font-bold font-display mb-2 sm:mb-3 gradient-text">Booking Successful!</h2>
          <p className="text-gray-500 mb-6">Your appointment has been registered. We will confirm soon via WhatsApp.</p>
          <div className="bg-pink-50 rounded-2xl p-4 mb-6 text-left text-sm space-y-2">
            <p><strong>Service:</strong> {selectedService?.name}</p>
            <p><strong>Date:</strong> {selectedDate && format(selectedDate, "EEEE, MMMM d", { locale: enUS })}</p>
            <p><strong>Time:</strong> {selectedTime}</p>
            <p><strong>Name:</strong> {formData.client_name}</p>
          </div>
          <a href="/">
            <motion.button whileHover={{ scale: 1.05 }} className="btn-primary w-full justify-center">Back to Home</motion.button>
          </a>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] gradient-hero pb-10 sm:pb-16 px-4" style={{ paddingTop: '100px' }}>
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="text-center mb-10 sm:mb-14"
        >
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold font-display mb-2 sm:mb-4">
            <span className="gradient-text">Book</span> your Appointment
          </h1>
          <p className="text-gray-500 text-sm sm:text-lg max-w-xl mx-auto px-4">
            Select your service, choose the date and time, and you're all set!
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-1.5 sm:gap-2 mb-6 sm:mb-10">
          {steps.map((step, i) => (
            <div key={i} className="flex items-center gap-1 sm:gap-2">
              <div className={`w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-[10px] sm:text-xs font-bold transition-all ${i <= currentStep ? 'gradient-primary text-white shadow-lg shadow-pink-500/25' : 'bg-gray-200 text-gray-400'}`}>
                {i < currentStep ? <HiCheck /> : i + 1}
              </div>
              <span className={`text-[10px] sm:text-xs hidden md:block ${i <= currentStep ? 'text-pink-500 font-medium' : 'text-gray-400'}`}>{step}</span>
              {i < steps.length - 1 && <div className={`w-4 sm:w-8 h-0.5 ${i < currentStep ? 'gradient-primary' : 'bg-gray-200'}`} />}
            </div>
          ))}
        </div>

        {/* Step Content */}
        <motion.div className="bg-white rounded-2xl sm:rounded-3xl shadow-xl shadow-pink-500/5 p-4 sm:p-6 lg:p-10 min-h-[350px] sm:min-h-[400px]">
          <AnimatePresence mode="wait">
            {/* Step 0: Seleccionar Servicio */}
            {currentStep === 0 && (
              <motion.div key="step0" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-bold flex items-center gap-2"><Flower2 className="text-pink-500" size={24} /> Choose your Service</h3>
                  <AnimatePresence>
                    {selectedService && (
                      <motion.button 
                        initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                        onClick={() => setCurrentStep(1)}
                        className="btn-primary py-2 px-6 text-sm flex items-center gap-2 shadow-lg shadow-pink-500/20"
                      >
                        Next <HiArrowRight />
                      </motion.button>
                    )}
                  </AnimatePresence>
                </div>
                <div className="space-y-8">
                  {Object.entries(groupedServices).map(([category, items]) => (
                    <div key={category}>
                      <h4 className="text-md font-bold text-pink-600 mb-3 border-b border-pink-100 pb-2">{category}</h4>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {items.map(s => (
                          <motion.button key={s.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                            onClick={() => setSelectedService(s)}
                            className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${selectedService?.id === s.id ? 'border-pink-500 bg-pink-50 shadow-lg shadow-pink-500/10' : 'border-gray-100 hover:border-pink-200'}`}>
                            <div className="flex justify-between items-start mb-2">
                              <h4 className="font-bold text-gray-800">{s.name}</h4>
                              <span className="text-pink-600 font-bold">${parseFloat(s.price).toFixed(2)}</span>
                            </div>
                            <p className="text-gray-400 text-xs line-clamp-2 mb-2">{s.description}</p>
                            <span className="text-xs text-purple-400 flex items-center gap-1"><HiClock /> {s.duration_minutes} min</span>
                          </motion.button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Step 1: Adicionales */}
            {currentStep === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-lg sm:text-xl font-bold mb-2 flex items-center gap-2"><Sparkles className="text-yellow-400" size={24} /> Add-ons (Optional)</h3>
                <p className="text-sm text-gray-500 mb-6">Personalize your service by adding the extras you want.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addons.map(s => {
                    const isSelected = selectedAddons.some(a => a.id === s.id);
                    return (
                      <motion.button key={s.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        onClick={() => {
                          if (isSelected) {
                            setSelectedAddons(selectedAddons.filter(a => a.id !== s.id));
                          } else {
                            setSelectedAddons([...selectedAddons, s]);
                          }
                        }}
                        className={`p-4 sm:p-5 rounded-xl sm:rounded-2xl border-2 text-left transition-all ${isSelected ? 'border-purple-500 bg-purple-50 shadow-lg shadow-purple-500/10' : 'border-gray-100 hover:border-purple-200'}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center gap-2">
                            <div className={`w-5 h-5 rounded flex items-center justify-center border ${isSelected ? 'bg-purple-500 border-purple-500' : 'border-gray-300'}`}>
                              {isSelected && <HiCheck className="text-white text-xs" />}
                            </div>
                            <h4 className="font-bold text-gray-800">{s.name}</h4>
                          </div>
                          <span className="text-purple-600 font-bold">+${parseFloat(s.price).toFixed(2)}</span>
                        </div>
                        <p className="text-gray-400 text-xs ml-7">{s.description}</p>
                      </motion.button>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* Step 2: Fecha y Hora */}
            {currentStep === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><HiCalendar className="text-pink-500" /> Select Date and Time</h3>
                {/* Fechas */}
                <div className="flex gap-3 overflow-x-auto pb-4 mb-6 scrollbar-hide">
                  {dates.map(date => (
                    <motion.button key={date.toISOString()} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      onClick={() => setSelectedDate(date)}
                      className={`flex-shrink-0 w-20 py-3 rounded-2xl text-center transition-all ${selectedDate?.toDateString() === date.toDateString() ? 'gradient-primary text-white shadow-lg' : 'bg-gray-50 hover:bg-pink-50 text-gray-600'}`}>
                      <p className="text-xs uppercase">{format(date, 'EEE', { locale: enUS })}</p>
                      <p className="text-2xl font-bold">{format(date, 'd')}</p>
                      <p className="text-xs">{format(date, 'MMM', { locale: enUS })}</p>
                    </motion.button>
                  ))}
                </div>
                {/* Horarios */}
                {selectedDate && (
                  <div>
                    <h4 className="font-semibold mb-3 flex items-center gap-2"><HiClock className="text-purple-500" /> Available Slots</h4>
                    {loadingSlots ? (
                      <div className="flex justify-center py-8"><div className="loader-nail scale-50" /></div>
                    ) : availableSlots.length > 0 ? (
                      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                        {availableSlots.map(slot => (
                          <motion.button key={slot.time} whileHover={slot.available ? { scale: 1.05 } : {}} whileTap={slot.available ? { scale: 0.95 } : {}}
                            onClick={() => slot.available && setSelectedTime(slot.time)} disabled={!slot.available}
                            className={`py-3 rounded-xl text-sm font-medium transition-all ${!slot.available ? 'bg-gray-100 text-gray-300 cursor-not-allowed line-through' : selectedTime === slot.time ? 'gradient-primary text-white shadow-lg' : 'bg-gray-50 text-gray-600 hover:bg-pink-50 hover:text-pink-600'}`}>
                            {slot.time}
                          </motion.button>
                        ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-400 py-8">No slots available for this date</p>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Step 3: Datos personales */}
            {currentStep === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><HiUser className="text-pink-500" /> Your Details</h3>
                <div className="space-y-5">
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Full Name *</label>
                    <div className="relative flex items-center">
                      <HiUser className="absolute left-4 text-gray-400 text-xl pointer-events-none" />
                      <input type="text" value={formData.client_name} onChange={e => {
                        const val = e.target.value.replace(/[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g, '');
                        setFormData({...formData, client_name: val});
                      }}
                        style={{ paddingLeft: '3rem' }}
                        placeholder="Your name" className="w-full pr-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Phone / WhatsApp *</label>
                    <div className="relative flex items-center">
                      <HiPhone className="absolute left-4 text-gray-400 text-xl pointer-events-none" />
                      <input type="tel" value={formData.client_phone} onChange={e => {
                        const val = e.target.value.replace(/[^\d+]/g, '');
                        setFormData({...formData, client_phone: val});
                      }}
                        style={{ paddingLeft: '3rem' }}
                        placeholder="+1 (203) 414-5441" className="w-full pr-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Email (optional)</label>
                    <div className="relative flex items-center">
                      <HiMail className="absolute left-4 text-gray-400 text-xl pointer-events-none" />
                      <input type="email" value={formData.client_email} onChange={e => setFormData({...formData, client_email: e.target.value})}
                        style={{ paddingLeft: '3rem' }}
                        placeholder="you@email.com" className="w-full pr-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all text-sm" />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600 mb-2 block">Additional notes</label>
                    <textarea value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} rows={3}
                      placeholder="Any design in mind? Allergies?" className="w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 focus:border-pink-400 focus:ring-4 focus:ring-pink-500/10 outline-none transition-all text-sm resize-none" />
                  </div>
                </div>
              </motion.div>
            )}

            {/* Step 4: Confirmación */}
            {currentStep === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><HiCheck className="text-green-500" /> Confirm your Booking</h3>
                <div className="bg-gradient-to-r from-pink-50 to-purple-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 space-y-3 sm:space-y-4 mb-4 sm:mb-6 text-sm">
                  
                  <div className="flex justify-between gap-2"><span className="text-gray-500">Base Service</span><span className="font-semibold text-right">{selectedService?.name}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-gray-500">Base Price</span><span className="font-bold text-pink-600">${parseFloat(selectedService?.price).toFixed(2)}</span></div>
                  
                  {selectedAddons.length > 0 && (
                    <div className="pt-2">
                      <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Add-ons ({selectedAddons.length})</p>
                      {selectedAddons.map(a => (
                        <div key={a.id} className="flex justify-between gap-2 mb-1">
                          <span className="text-gray-600 pl-2 border-l-2 border-purple-200">{a.name}</span>
                          <span className="font-semibold text-purple-600">+${parseFloat(a.price).toFixed(2)}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  <hr className="border-pink-200/50" />
                  
                  <div className="flex justify-between gap-2"><span className="text-gray-500">Date</span><span className="font-semibold text-right text-xs sm:text-sm">{selectedDate && format(selectedDate, "EEEE, MMMM d", { locale: enUS })}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-gray-500">Time</span><span className="font-semibold">{selectedTime}</span></div>
                  
                  <hr className="border-pink-200/50" />
                  
                  <div className="flex justify-between gap-2"><span className="text-gray-500">Booked under</span><span className="font-semibold text-right">{formData.client_name}</span></div>
                  <div className="flex justify-between gap-2"><span className="text-gray-500">Phone</span><span className="font-semibold">{formData.client_phone}</span></div>
                  
                  <hr className="border-pink-200/80 mt-2" />
                  <div className="flex justify-between gap-2 items-center pt-2">
                    <span className="text-gray-800 font-bold uppercase tracking-wider">Estimated Total</span>
                    <span className="font-black text-xl text-pink-600">
                      ${(parseFloat(selectedService?.price || 0) + selectedAddons.reduce((acc, curr) => acc + parseFloat(curr.price), 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Navigation Buttons */}
          <div className="sticky bottom-4 z-40 bg-white/95 backdrop-blur-md p-4 sm:p-5 rounded-2xl shadow-2xl shadow-pink-500/20 flex justify-between mt-6 sm:mt-8 border border-pink-100">
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              className={`flex items-center gap-1.5 sm:gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl font-medium text-sm sm:text-base transition-all ${currentStep === 0 ? 'invisible' : 'text-gray-500 hover:text-pink-500 hover:bg-pink-50'}`}>
              <HiArrowLeft /> Previous
            </motion.button>
            {currentStep < 4 ? (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={() => canAdvance() && setCurrentStep(currentStep + 1)} disabled={!canAdvance()}
                className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold transition-all ${canAdvance() ? 'btn-primary' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}>
                Next <HiArrowRight />
              </motion.button>
            ) : (
              <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                onClick={handleSubmit} disabled={submitting}
                className="btn-primary px-10 py-3 text-base shadow-lg shadow-pink-500/30">
                {submitting ? 'Booking...' : <span className="flex items-center gap-2"><Sparkles size={20} /> Confirm Booking</span>}
              </motion.button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
