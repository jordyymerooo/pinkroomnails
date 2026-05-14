import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Star, 
  X, 
  Image as ImageIcon, 
  Sparkles,
  Upload,
  Check,
  Tag
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

export default function GalleryPage() {
  const [images, setImages] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showUpload, setShowUpload] = useState(false);
  const [form, setForm] = useState({ title: '', category: '', is_featured: false });
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const fetchImages = () => api.get('/gallery').then(res => setImages(res.data));
  const fetchCategories = () => api.get('/categories').then(res => {
    setCategories(res.data);
    if (res.data.length > 0) setForm(prev => ({ ...prev, category: res.data[0].name }));
  });

  useEffect(() => { 
    fetchImages(); 
    fetchCategories();
  }, []);

  const upload = async (e) => {
    e.preventDefault();
    if (!file) return toast.error('Select an image');
    setUploading(true);
    const fd = new FormData();
    fd.append('image', file);
    fd.append('title', form.title);
    fd.append('category', form.category);
    fd.append('is_featured', form.is_featured ? '1' : '0');
    try { 
      await api.post('/admin/gallery', fd, { headers: { 'Content-Type': 'multipart/form-data' } }); 
      toast.success('Artwork uploaded successfully'); 
      setShowUpload(false); 
      setFile(null); 
      fetchImages(); 
    } catch { toast.error('Error uploading artwork'); }
    finally { setUploading(false); }
  };

  const remove = async (id) => {
    if (!confirm('Remove this image from portfolio?')) return;
    try { 
      await api.delete(`/admin/gallery/${id}`); 
      toast.success('Image removed'); 
      fetch(); 
    } catch { toast.error('Error removing image'); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display tracking-tight">Portfolio & Gallery</h1>
          <p className="text-gray-500 text-sm mt-1">Showcase your best works and creations</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowUpload(true)}
          className="relative group inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-2xl text-white font-bold text-sm shadow-lg shadow-fuchsia-500/20 overflow-hidden"
        >
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute inset-0 bg-white"
          />
          <Plus size={18} className="relative z-10" />
          <span className="relative z-10">Upload Artwork</span>
        </motion.button>
      </div>

      {/* Gallery Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            whileHover={{ y: -8 }}
            className="group relative aspect-[4/5] rounded-[2rem] overflow-hidden bg-gray-900 border border-gray-800 transition-all duration-500 hover:border-fuchsia-500/50 hover:shadow-2xl hover:shadow-fuchsia-500/10"
          >
            <img 
              src={`/storage/${img.image_path}`} 
              alt={img.title} 
              className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-80 group-hover:opacity-100" 
            />
            
            {/* Glass Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-transparent to-gray-950/40 opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-between p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-1 px-3 py-1 bg-gray-950/80 backdrop-blur-md rounded-full border border-gray-800 text-[10px] font-bold text-gray-300 uppercase tracking-widest">
                  <Tag size={10} className="text-fuchsia-500" />
                  {img.category}
                </div>
                {img.is_featured && (
                  <div className="w-8 h-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg">
                    <Star size={14} className="text-white fill-white" />
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-4">
                <p className="text-white font-display text-sm font-bold truncate tracking-tight">{img.title || 'PinkRoom Creation'}</p>
                <div className="flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => remove(img.id)}
                    className="w-full py-2 bg-red-500/20 backdrop-blur-md text-red-400 border border-red-500/30 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
                  >
                    Remove Artwork
                  </motion.button>
                </div>
              </div>
            </div>

            {!img.is_featured && (
              <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                 <button className="p-2 bg-gray-950/80 backdrop-blur-md rounded-full border border-gray-800 text-gray-500 hover:text-amber-400">
                    <Star size={16} />
                 </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {images.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 px-8 bg-gray-900/30 border border-gray-800 rounded-[2.5rem] backdrop-blur-sm">
          <div className="w-24 h-24 rounded-full bg-gray-950 flex items-center justify-center mb-6 border border-gray-800 shadow-inner">
            <ImageIcon size={40} className="text-gray-800" />
          </div>
          <h3 className="text-xl font-bold text-white font-display">Empty Gallery</h3>
          <p className="text-gray-500 text-sm mt-1 max-w-xs text-center">It's time to upload your best designs and dazzle your clients.</p>
        </div>
      )}

      {/* Upload Modal */}
      <AnimatePresence>
        {showUpload && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              className="bg-gray-900 border border-gray-800 rounded-[2.5rem] p-8 lg:p-10 w-full max-w-md relative shadow-2xl"
            >
              <button
                onClick={() => setShowUpload(false)}
                className="absolute top-8 right-8 text-gray-500 hover:text-white transition-colors"
              >
                <X size={24} />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-bold text-white font-display mb-1">New Masterpiece</h2>
                <p className="text-gray-500 text-sm">Capture the essence of your talent</p>
              </div>

              <form onSubmit={upload} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Artwork Image</label>
                  <div className="relative group/file">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={e => setFile(e.target.files[0])}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      required
                    />
                    <div className="w-full h-40 bg-gray-950 border border-dashed border-gray-800 rounded-[2rem] flex flex-col items-center justify-center gap-3 group-hover/file:border-fuchsia-500/50 transition-all overflow-hidden relative">
                      {file ? (
                        <div className="absolute inset-0 p-2">
                           <div className="w-full h-full bg-gray-900 rounded-[1.5rem] flex items-center justify-center text-fuchsia-500 font-bold text-xs truncate px-4">
                              <Check size={16} className="mr-2" /> {file.name}
                           </div>
                        </div>
                      ) : (
                        <>
                          <Upload size={32} className="text-gray-700 group-hover/file:text-fuchsia-500/50 transition-colors" />
                          <span className="text-gray-600 text-[10px] font-bold uppercase tracking-widest">Drop or select file</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Creative Title</label>
                  <input
                    value={form.title}
                    onChange={e => setForm({...form, title: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-fuchsia-500 transition-colors"
                    placeholder="e.g. Galaxy Sparkle Design"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-4">Design Category</label>
                  <select
                    value={form.category}
                    onChange={e => setForm({...form, category: e.target.value})}
                    className="w-full bg-gray-950 border border-gray-800 rounded-2xl px-6 py-4 text-white text-sm outline-none focus:border-fuchsia-500 transition-colors appearance-none cursor-pointer"
                  >
                    {categories.map(c => (
                      <option key={c.id} value={c.name}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div className="flex items-center justify-between py-2">
                  <label className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${form.is_featured ? 'bg-amber-500 border-amber-500' : 'border-gray-800 bg-gray-950 group-hover:border-gray-600'}`}>
                      {form.is_featured && <Star size={14} className="text-white fill-white" />}
                      <input
                        type="checkbox"
                        checked={form.is_featured}
                        onChange={e => setForm({...form, is_featured: e.target.checked})}
                        className="hidden"
                      />
                    </div>
                    <span className="text-gray-400 text-xs font-bold uppercase tracking-widest">Feature on Home</span>
                  </label>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={uploading}
                  className="w-full bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-2xl py-5 text-white font-bold text-sm shadow-xl shadow-fuchsia-500/20 disabled:opacity-50"
                >
                  {uploading ? 'Uploading...' : 'Publish Artwork'}
                </motion.button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
