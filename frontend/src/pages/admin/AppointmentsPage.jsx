import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CheckCircle, 
  XCircle, 
  Trash2, 
  Search, 
  User, 
  Phone,
  ChevronLeft,
  ChevronRight,
  Eye,
  Sparkles,
  Calendar,
  Clock,
  Plus
} from 'lucide-react';
import { HiX } from 'react-icons/hi';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const formatLongDate = (dateStr) => {
  if (!dateStr) return '---';
  try {
    // Extraemos solo la parte YYYY-MM-DD en caso de que venga con T00:00:00.000000Z
    const cleanDate = dateStr.substring(0, 10);
    // Al añadir T12:00:00 forzamos a que se interprete en el mediodía local, 
    // evitando que el timezone lo empuje al día anterior.
    const date = new Date(`${cleanDate}T12:00:00`);
    if (isNaN(date.getTime())) return dateStr;
    return new Intl.DateTimeFormat('en-US', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    }).format(date);
  } catch (e) {
    return dateStr;
  }
};

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [meta, setMeta] = useState({});
  const [services, setServices] = useState([]);
  
  // Create Modal State
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createForm, setCreateForm] = useState({
    service_id: '',
    client_name: '',
    client_phone: '',
    appointment_date: '',
    appointment_time: '',
    appointment_time: '',
    notes: ''
  });
  
  // Edit Modal State
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState(null);

  const fetchAppointments = (p = 1) => {
    setLoading(true);
    const params = { page: p };
    if (filter !== 'all') params.status = filter;
    api.get('/admin/appointments', { params })
      .then(res => { 
        setAppointments(res.data.data); 
        setMeta(res.data); 
        setPage(p); 
      })
      .catch(console.error).finally(() => setLoading(false));
  };

  useEffect(() => { 
    fetchAppointments(); 
    api.get('/services').then(res => setServices(res.data)).catch(console.error);
  }, [filter]);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/admin/appointments', createForm);
      toast.success('Appointment created successfully');
      setShowCreateModal(false);
      setCreateForm({ service_id: '', client_name: '', client_phone: '', appointment_date: '', appointment_time: '', notes: '' });
      fetchAppointments(1);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error creating appointment');
    }
  };

  const openEditModal = (appointment) => {
    setEditForm({
      ...appointment,
      appointment_time: appointment.appointment_time.substring(0, 5) // HH:mm format
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/admin/appointments/${editForm.id}`, {
        service_id: editForm.service_id,
        appointment_date: editForm.appointment_date,
        appointment_time: editForm.appointment_time,
        client_name: editForm.client_name,
        client_phone: editForm.client_phone,
        notes: editForm.notes
      });
      toast.success('Appointment updated successfully');
      setShowEditModal(false);
      fetchAppointments(page);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Error updating appointment');
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/admin/appointments/${id}`, { status });
      toast.success(`Appointment ${status === 'confirmed' ? 'confirmed' : status === 'cancelled' ? 'cancelled' : 'updated'}`);
      fetchAppointments(page);
    } catch { toast.error('Error updating'); }
  };

  const deleteAppointment = async (id) => {
    if (!window.confirm('Delete this appointment?')) return;
    try { 
      await api.delete(`/admin/appointments/${id}`); 
      toast.success('Deleted'); 
      fetchAppointments(page); 
    } catch { toast.error('Error deleting'); }
  };

  const filtered = appointments.filter(a => 
    !search || 
    a.client_name.toLowerCase().includes(search.toLowerCase()) || 
    a.client_phone.includes(search)
  );

  const statusBadge = (status) => {
    const configs = {
      pending: {
        label: 'Pending',
        styles: 'bg-amber-900/40 text-amber-300 border border-amber-700/50',
      },
      confirmed: {
        label: 'Confirmed',
        styles: 'bg-green-900/40 text-green-300 border border-green-700/50',
      },
      completed: {
        label: 'Completed',
        styles: 'bg-blue-900/40 text-blue-300 border border-blue-700/50',
      },
      cancelled: {
        label: 'Cancelled',
        styles: 'bg-rose-900/40 text-rose-300 border border-rose-700/50',
      },
    };

    const config = configs[status] || configs.pending;

    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium tracking-wide inline-block whitespace-nowrap ${config.styles}`}>
        {config.label}
      </span>
    );
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display tracking-tight">Appointments</h1>
          <p className="text-gray-400 text-sm mt-1 font-sans">Monitor and confirm your bookings in real time</p>
        </div>
        <motion.button 
          whileHover={{ scale: 1.05 }} 
          onClick={() => setShowCreateModal(true)} 
          className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl flex items-center gap-2 font-bold transition-colors"
        >
          <Plus size={20} /> New Appointment
        </motion.button>
      </div>

      {/* Modern Filter Bar */}
      <div className="flex flex-col lg:flex-row gap-6">
        <div className="relative flex-1 group">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-500 group-focus-within:text-fuchsia-500 transition-colors" size={20} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by name, phone or service..."
            className="w-full bg-gray-900/50 border border-gray-800 rounded-2xl pl-14 pr-6 py-4 text-gray-100 text-sm outline-none focus:border-fuchsia-500 transition-all backdrop-blur-sm font-sans"
          />
        </div>
        
        <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 scrollbar-hide">
          {['all', 'pending', 'confirmed', 'completed', 'cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all whitespace-nowrap border font-sans ${
                filter === s 
                  ? 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20' 
                  : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:text-gray-200 hover:border-gray-700 backdrop-blur-sm'
              }`}
            >
              {s === 'all' ? 'All' : s === 'pending' ? 'Pending' : s === 'confirmed' ? 'Confirmed' : s === 'completed' ? 'Completed' : 'Cancelled'}
            </button>
          ))}
        </div>
      </div>

      {/* Datagrid Wrapper - NUEVA ESTRUCTURA APLICADA */}
      <div className="bg-gray-900/40 border border-white/10 rounded-[2.5rem] backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="overflow-x-auto custom-scrollbar"> {/* Scroll lateral de seguridad */}
          <table className="w-full text-left border-collapse min-w-[900px]"> {/* Min-width para evitar amontonamiento */}
            <thead>
              <tr className="bg-white/[0.03] border-b border-white/5">
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Client</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Service</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Schedule</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400">Status</th>
                <th className="p-8 text-[11px] font-black uppercase tracking-[0.2em] text-gray-400 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filtered.map((a, i) => (
                  <motion.tr
                    key={a.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ delay: i * 0.05 }}
                    className="hover:bg-white/[0.02] transition-all group"
                  >
                    <td className="p-8 align-middle">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-950 flex items-center justify-center border border-gray-700/50 shadow-inner flex-shrink-0">
                          <User size={18} className="text-gray-100 group-hover:text-fuchsia-400 transition-colors" />
                        </div>
                        <div className="flex flex-col justify-center">
                          <p className="text-white font-bold font-sans tracking-tight text-sm">{a.client_name}</p>
                          <p className="text-gray-400 text-xs flex items-center gap-1.5 mt-1 font-sans"><Phone size={10} /> {a.client_phone}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-8 align-middle">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-gray-950/50 border border-gray-800 rounded-lg max-w-full">
                        <Sparkles size={14} className="text-fuchsia-500 flex-shrink-0" />
                        <span className="text-white font-medium text-sm truncate font-sans">{a.service?.name}</span>
                      </div>
                    </td>
                    <td className="p-8 align-middle">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 text-white font-medium text-sm font-sans capitalize">
                          <Calendar size={14} className="text-gray-400" />
                          {formatLongDate(a.appointment_date)}
                        </div>
                        <div className="flex items-center gap-2 text-gray-400 font-bold text-xs font-sans">
                          <Clock size={14} className="text-gray-500" />
                          {a.appointment_time}
                        </div>
                      </div>
                    </td>
                    <td className="p-8 align-middle">
                      {statusBadge(a.status)}
                    </td>
                    <td className="p-8 align-middle">
                      <div className="flex items-center justify-center gap-4">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => openEditModal(a)}
                          className="text-gray-500 hover:text-fuchsia-400 transition-colors"
                          title="Edit Appointment"
                        >
                          <Eye size={20} />
                        </motion.button>
                        
                        {a.status === 'pending' && (
                          <>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateStatus(a.id, 'confirmed')}
                              className="text-gray-500 hover:text-green-400 transition-colors"
                              title="Confirm Appointment"
                            >
                              <CheckCircle size={20} />
                            </motion.button>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateStatus(a.id, 'cancelled')}
                              className="text-gray-500 hover:text-rose-400 transition-colors"
                              title="Cancel Appointment"
                            >
                              <XCircle size={20} />
                            </motion.button>
                          </>
                        )}
                        {a.status === 'confirmed' && (
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateStatus(a.id, 'completed')}
                            className="text-gray-500 hover:text-blue-400 transition-colors"
                            title="Complete Appointment"
                          >
                            <CheckCircle size={20} />
                          </motion.button>
                        )}
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => deleteAppointment(a.id)}
                          className="text-gray-500 hover:text-red-400 transition-colors"
                          title="Delete Record"
                        >
                          <Trash2 size={20} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filtered.length === 0 && (
            <div className="flex flex-col items-center justify-center py-24 px-8">
              <div className="w-20 h-20 rounded-full bg-gray-950 flex items-center justify-center mb-4 border border-gray-800 shadow-inner">
                <Search size={32} className="text-gray-600" />
              </div>
              <p className="text-gray-400 text-sm font-medium font-sans">No matching records found</p>
            </div>
          )}
        </div>
      </div>

      {/* Premium Pagination */}
      {meta.last_page > 1 && (
        <div className="flex items-center justify-center gap-4 py-4 font-sans">
          <motion.button
            whileHover={page > 1 ? { x: -3 } : {}}
            onClick={() => page > 1 && fetchAppointments(page - 1)}
            disabled={page === 1}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
              page === 1 ? 'border-gray-800 text-gray-700' : 'border-gray-800 bg-gray-900/50 text-gray-300 hover:border-fuchsia-500'
            }`}
          >
            <ChevronLeft size={20} />
          </motion.button>
          
          <div className="flex items-center gap-2">
            {Array.from({ length: meta.last_page }, (_, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -2 }}
                onClick={() => fetchAppointments(i + 1)}
                className={`w-12 h-12 rounded-2xl text-xs font-bold transition-all border ${
                  page === i + 1 
                    ? 'bg-fuchsia-600 border-fuchsia-500 text-white shadow-lg shadow-fuchsia-500/20' 
                    : 'bg-gray-900/50 border-gray-800 text-gray-400 hover:text-gray-200'
                }`}
              >
                {i + 1}
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={page < meta.last_page ? { x: 3 } : {}}
            onClick={() => page < meta.last_page && fetchAppointments(page + 1)}
            disabled={page === meta.last_page}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all border ${
              page === meta.last_page ? 'border-gray-800 text-gray-700' : 'border-gray-800 bg-gray-900/50 text-gray-300 hover:border-fuchsia-500'
            }`}
          >
            <ChevronRight size={20} />
          </motion.button>
        </div>
      )}

      {/* Create Appointment Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Calendar className="text-fuchsia-500" /> Book New Appointment</h2>
                <button onClick={() => setShowCreateModal(false)} className="text-gray-500 hover:text-white"><HiX size={20} /></button>
              </div>
              <form onSubmit={handleCreateSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Base Service *</label>
                    <select 
                      value={createForm.service_id} 
                      onChange={e => setCreateForm({...createForm, service_id: e.target.value})} 
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required
                    >
                      <option value="" disabled>Select a service</option>
                      {services.filter(s => s.category !== 'add_ons').map(s => (
                        <option key={s.id} value={s.id}>{s.name} (${parseFloat(s.price).toFixed(2)})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Date *</label>
                    <input 
                      type="date" 
                      value={createForm.appointment_date} 
                      onChange={e => setCreateForm({...createForm, appointment_date: e.target.value})} 
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Time *</label>
                    <input 
                      type="time" 
                      value={createForm.appointment_time} 
                      onChange={e => setCreateForm({...createForm, appointment_time: e.target.value})} 
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Client Name *</label>
                    <input 
                      type="text" 
                      value={createForm.client_name} 
                      onChange={e => setCreateForm({...createForm, client_name: e.target.value})} 
                      placeholder="e.g. Jane Doe"
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      value={createForm.client_phone} 
                      onChange={e => setCreateForm({...createForm, client_phone: e.target.value})} 
                      placeholder="+123456789"
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Notes / Add-ons (Optional)</label>
                    <textarea 
                      value={createForm.notes} 
                      onChange={e => setCreateForm({...createForm, notes: e.target.value})} 
                      placeholder="Add special notes or add-ons here..."
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors resize-none" 
                      rows={3} 
                    />
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  className="w-full mt-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-fuchsia-500/20"
                >
                  Confirm and Save Appointment
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Appointment Modal */}
      <AnimatePresence>
        {showEditModal && editForm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-xl max-h-[90vh] overflow-y-auto custom-scrollbar">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white flex items-center gap-2"><Eye className="text-fuchsia-500" /> Edit Appointment</h2>
                <button onClick={() => setShowEditModal(false)} className="text-gray-500 hover:text-white"><HiX size={20} /></button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Base Service *</label>
                    <select 
                      value={editForm.service_id} 
                      onChange={e => setEditForm({...editForm, service_id: e.target.value})} 
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required
                    >
                      <option value="" disabled>Select a service</option>
                      {services.filter(s => s.category !== 'add_ons').map(s => (
                        <option key={s.id} value={s.id}>{s.name} (${parseFloat(s.price).toFixed(2)})</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Date *</label>
                    <input 
                      type="date" 
                      value={editForm.appointment_date} 
                      onChange={e => setEditForm({...editForm, appointment_date: e.target.value})} 
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Time *</label>
                    <input 
                      type="time" 
                      value={editForm.appointment_time} 
                      onChange={e => setEditForm({...editForm, appointment_time: e.target.value})} 
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Client Name *</label>
                    <input 
                      type="text" 
                      value={editForm.client_name} 
                      onChange={e => setEditForm({...editForm, client_name: e.target.value})} 
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Phone / WhatsApp *</label>
                    <input 
                      type="tel" 
                      value={editForm.client_phone} 
                      onChange={e => setEditForm({...editForm, client_phone: e.target.value})} 
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors" 
                      required 
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="text-sm font-medium text-gray-400 mb-1.5 block">Notes / Add-ons (Optional)</label>
                    <textarea 
                      value={editForm.notes || ''} 
                      onChange={e => setEditForm({...editForm, notes: e.target.value})} 
                      className="w-full bg-gray-950 border border-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:border-fuchsia-500 transition-colors resize-none" 
                      rows={3} 
                    />
                  </div>
                </div>
                <motion.button 
                  whileHover={{ scale: 1.02 }} 
                  whileTap={{ scale: 0.98 }} 
                  type="submit" 
                  className="w-full mt-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-xl transition-colors shadow-lg shadow-fuchsia-500/20"
                >
                  Save Changes
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}