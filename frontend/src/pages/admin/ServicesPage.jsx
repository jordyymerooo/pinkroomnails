import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiPlus, HiX } from 'react-icons/hi';
import { Sparkles, Clock, Pencil, Trash2, FolderPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function ServicesPage() {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  
  // Service Modal State
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', description: '', price: '', duration_minutes: '60', category: '', is_active: true });
  const [imageFile, setImageFile] = useState(null);
  const [deleteImage, setDeleteImage] = useState(false);

  // Category Modal State
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '' });

  const fetchServices = () => api.get('/services').then(res => setServices(res.data)).catch(() => {});
  const fetchCategories = () => api.get('/categories').then(res => setCategories(res.data)).catch(() => {});
  
  useEffect(() => { fetchServices(); fetchCategories(); }, []);

  // --- Service Actions ---
  const openEdit = (s) => {
    setEditing(s);
    setForm({ name: s.name, description: s.description || '', price: s.price, duration_minutes: s.duration_minutes, category: s.category || '', is_active: s.is_active });
    setImageFile(null);
    setDeleteImage(false);
    setShowModal(true);
  };

  const openCreate = () => { 
    setEditing(null); 
    setForm({ name: '', description: '', price: '', duration_minutes: '60', category: categories[0]?.name || '', is_active: true }); 
    setImageFile(null); 
    setDeleteImage(false);
    setShowModal(true); 
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fd = new FormData();
    
    // Convertir booleanos a enteros para Laravel
    const dataToSend = { ...form, is_active: form.is_active ? 1 : 0 };
    
    Object.entries(dataToSend).forEach(([k, v]) => fd.append(k, v));
    if (imageFile) fd.append('image', imageFile);
    if (deleteImage) fd.append('delete_image', '1');
    
    try {
      if (editing) { 
        await api.post(`/admin/services/${editing.id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } }); 
        toast.success('Service updated'); 
      } else { 
        await api.post('/admin/services', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); 
        toast.success('Service created'); 
      }
      setShowModal(false); 
      fetchServices();
    } catch (err) { 
      toast.error('Error saving'); 
    }
  };

  const deleteService = async (id) => {
    if (!window.confirm('Delete this service?')) return;
    try { await api.delete(`/admin/services/${id}`); toast.success('Deleted'); fetchServices(); }
    catch { toast.error('Error deleting'); }
  };

  // --- Category Actions ---
  const openCreateCategory = () => { setEditingCategory(null); setCategoryForm({ name: '' }); setShowCategoryModal(true); };
  const openEditCategory = (c) => { setEditingCategory(c); setCategoryForm({ name: c.name }); setShowCategoryModal(true); };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await api.put(`/admin/categories/${editingCategory.id}`, categoryForm);
        toast.success('Category updated');
      } else {
        await api.post('/admin/categories', categoryForm);
        toast.success('Category created');
      }
      setShowCategoryModal(false);
      fetchCategories();
      fetchServices(); // Refetch services to update their names if category changed
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Error saving category'); 
    }
  };

  const deleteCategory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category? Services will become "Uncategorized" but won\'t be deleted.')) return;
    try {
      await api.delete(`/admin/categories/${id}`);
      toast.success('Category deleted');
      await Promise.all([fetchCategories(), fetchServices()]);
    } catch (err) { 
      toast.error(err.response?.data?.message || 'Error deleting category'); 
    }
  };

  // Agrupar servicios
  const servicesWithoutCategory = services.filter(s => !s.category || !categories.some(c => c.name === s.category));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Catalog and Categories</h1>
          <p className="text-gray-500 text-sm">Manage your services organized by categories</p>
        </div>
        <div className="flex flex-wrap gap-3">
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            onClick={() => setShowCategoryModal(true)} 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-xl flex items-center gap-2 font-bold transition-colors border border-white/10"
          >
            <FolderPlus size={18} className="text-fuchsia-400" /> Manage Categories
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02 }} 
            onClick={openCreate} 
            className="px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-xl flex items-center gap-2 font-bold transition-colors shadow-lg shadow-fuchsia-500/20"
          >
            <HiPlus size={18} /> New Service
          </motion.button>
        </div>
      </div>

      {/* Category Management Toolbar (Mobile Friendly) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map(cat => (
          <div key={cat.id} className="bg-gray-900/40 border border-white/5 p-4 rounded-2xl flex items-center justify-between group">
            <span className="text-gray-300 font-medium truncate pr-2">{cat.name}</span>
            <div className="flex gap-1.5 opacity-60 group-hover:opacity-100 transition-opacity">
              <button onClick={() => openEditCategory(cat)} className="p-1.5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors">
                <Pencil size={14}/>
              </button>
              {cat.name.toLowerCase() !== 'add-ons' && (
                <button onClick={() => deleteCategory(cat.id)} className="p-1.5 hover:bg-rose-500/10 rounded-lg text-gray-400 hover:text-rose-500 transition-colors">
                  <Trash2 size={14}/>
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="h-px bg-gradient-to-r from-transparent via-white/10 to-transparent my-8" />

      {categories.map(cat => {
        const categoryServices = services.filter(s => s.category === cat.name);
        
        return (
          <div key={cat.id} className="mb-10 bg-gray-900/10 p-6 rounded-[2.5rem] border border-white/5">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4 px-2">
              <div className="flex items-center gap-3">
                <h2 className="text-xl font-bold text-white">{cat.name}</h2>
                <span className="text-[10px] font-bold bg-fuchsia-900/40 border border-fuchsia-500/30 text-fuchsia-300 px-3 py-1 rounded-full uppercase tracking-wider">
                  {categoryServices.length} services
                </span>
              </div>
            </div>

            {categoryServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                {categoryServices.map((s, i) => (
                  <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }} className="group relative bg-gray-950 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-lg">
                    <div className="h-40 bg-gray-900 relative">
                      {s.image_path || s.image ? (
                        <img src={`/storage/${s.image_path || s.image}`} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-all duration-700" alt={s.name} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-fuchsia-900/10 to-black">
                          <Sparkles className="text-fuchsia-500/20" size={40} />
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl">
                        <span className="text-fuchsia-400 font-bold text-sm">${parseFloat(s.price).toFixed(2)}</span>
                      </div>
                    </div>
                    <div className="p-5">
                      <h3 className="text-lg font-bold text-white mb-1 truncate">{s.name}</h3>
                      <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{s.description}</p>
                      <div className="flex items-center justify-between border-t border-white/5 pt-4">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-400">
                          <Clock size={12} className="text-fuchsia-500" /> {s.duration_minutes} MIN
                        </div>
                        <div className="flex gap-2">
                          <button onClick={() => openEdit(s)} className="p-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"><Pencil size={14} /></button>
                          <button onClick={() => deleteService(s.id)} className="p-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-center py-6 text-gray-500 text-sm font-medium">No services in this category.</p>
            )}
          </div>
        );
      })}

      {/* Servicios sin categoría */}
      {servicesWithoutCategory.length > 0 && (
        <div className="mb-10 bg-gray-900/20 p-6 rounded-[2.5rem] border border-rose-500/20">
          <div className="flex items-center gap-3 mb-6 border-b border-white/10 pb-4 px-2">
            <h2 className="text-xl font-bold text-gray-300">Others / Uncategorized</h2>
            <span className="text-[10px] font-bold bg-gray-800 text-gray-400 px-3 py-1 rounded-full uppercase tracking-wider">{servicesWithoutCategory.length} services</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {servicesWithoutCategory.map((s, i) => (
              <motion.div key={s.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} whileHover={{ y: -5 }} className="group relative bg-gray-950 border border-white/5 rounded-3xl overflow-hidden backdrop-blur-md shadow-lg">
                <div className="p-5">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-lg font-bold text-white mb-1 truncate">{s.name}</h3>
                    <span className="text-fuchsia-400 font-bold text-sm bg-fuchsia-500/10 px-2 py-1 rounded-lg">${parseFloat(s.price).toFixed(2)}</span>
                  </div>
                  <p className="text-gray-500 text-xs leading-relaxed mb-4 line-clamp-2">{s.description}</p>
                  <div className="flex items-center justify-between border-t border-white/5 pt-4">
                    <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase text-gray-400">
                      <Clock size={12} className="text-fuchsia-500" /> {s.duration_minutes} MIN
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => openEdit(s)} className="p-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-white transition-colors"><Pencil size={14} /></button>
                      <button onClick={() => deleteService(s.id)} className="p-1.5 bg-white/5 rounded-lg text-gray-400 hover:text-rose-500 transition-colors"><Trash2 size={14} /></button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Modal Servicios */}
      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-lg max-h-[90vh] overflow-y-auto overflow-x-hidden">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">{editing ? 'Edit' : 'New'} Service</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-white"><HiX size={20} /></button>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div><label className="text-sm text-gray-400 mb-1 block">Name</label><input value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="w-full bg-gray-800 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" required /></div>
                <div><label className="text-sm text-gray-400 mb-1 block">Description</label><textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} className="w-full bg-gray-800 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" rows={3} /></div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-sm text-gray-400 mb-1 block">Price ($)</label><input type="number" step="0.01" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="w-full bg-gray-800 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" required /></div>
                  <div><label className="text-sm text-gray-400 mb-1 block">Duration (min)</label><input type="number" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})} className="w-full bg-gray-800 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" required /></div>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Category</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-gray-800 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" required>
                    <option value="" disabled>Select a category</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Image</label>
                  {editing && editing.image && !deleteImage && (
                    <div className="relative w-full h-32 mb-3 rounded-xl overflow-hidden group">
                      <img src={`/storage/${editing.image}`} className="w-full h-full object-cover" alt="Current" />
                      <button 
                        type="button" 
                        onClick={() => setDeleteImage(true)}
                        className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-bold text-sm"
                      >
                        <Trash2 size={16} className="mr-2" /> Remove current image
                      </button>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={e => { setImageFile(e.target.files[0]); setDeleteImage(false); }} className="w-full bg-gray-800 text-white rounded-xl px-4 py-2 outline-none focus:ring-2 focus:ring-fuchsia-500" />
                  {deleteImage && <p className="text-rose-400 text-xs mt-1">Current image will be removed.</p>}
                </div>
                <label className="flex items-center gap-3 cursor-pointer pt-2">
                  <input type="checkbox" checked={form.is_active} onChange={e => setForm({...form, is_active: e.target.checked})} className="w-5 h-5 rounded accent-pink-500" />
                  <span className="text-gray-400 text-sm">Service active on website</span>
                </label>
                <motion.button whileHover={{ scale: 1.02 }} type="submit" className="w-full mt-4 bg-fuchsia-600 hover:bg-fuchsia-700 text-white font-bold py-3 rounded-xl transition-colors">{editing ? 'Update' : 'Create'} Service</motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Modal Categorías */}
      <AnimatePresence>
        {showCategoryModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-gray-900 border border-gray-800 rounded-3xl p-8 w-full max-w-sm shadow-2xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-white">{editingCategory ? 'Edit' : 'New'} Category</h2>
                <button onClick={() => setShowCategoryModal(false)} className="text-gray-500 hover:text-white"><HiX size={20} /></button>
              </div>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="text-sm text-gray-400 mb-1 block">Category Name</label>
                  <input 
                    value={categoryForm.name} 
                    onChange={e => setCategoryForm({ name: e.target.value })} 
                    placeholder="e.g. Premium Spa"
                    className="w-full bg-gray-800 text-white rounded-xl px-4 py-3 outline-none focus:ring-2 focus:ring-fuchsia-500 border border-gray-700" 
                    required 
                  />
                </div>
                <motion.button whileHover={{ scale: 1.02 }} type="submit" className="w-full bg-white hover:bg-gray-200 text-black font-bold py-3 rounded-xl transition-colors mt-2">
                  {editingCategory ? 'Save Changes' : 'Create Category'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}