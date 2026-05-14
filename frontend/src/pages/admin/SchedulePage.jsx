import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Save, 
  Clock, 
  Moon, 
  Sun, 
  AlertCircle,
  Calendar,
  CheckCircle2
} from 'lucide-react';
import toast from 'react-hot-toast';
import api from '../../api/axios';

const dayTranslations = {
  'Lunes': 'Monday',
  'Martes': 'Tuesday',
  'Miércoles': 'Wednesday',
  'Jueves': 'Thursday',
  'Viernes': 'Friday',
  'Sábado': 'Saturday',
  'Domingo': 'Sunday'
};

export default function SchedulePage() {
  const [schedules, setSchedules] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => { 
    api.get('/schedules')
      .then(res => setSchedules(res.data))
      .catch(console.error); 
  }, []);

  const update = (index, field, value) => {
    const updated = [...schedules];
    updated[index] = { ...updated[index], [field]: value };
    setSchedules(updated);
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put('/admin/schedules', { 
        schedules: schedules.map(s => ({ 
          id: s.id, 
          start_time: s.start_time?.substring(0, 5), 
          end_time: s.end_time?.substring(0, 5), 
          is_active: s.is_active 
        })) 
      });
      toast.success('Master Schedule Saved');
    } catch { toast.error('Error syncing schedules'); }
    finally { setSaving(false); }
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white font-display tracking-tight">Business Hours</h1>
          <p className="text-gray-500 text-sm mt-1">Configure the rhythmic availability of your salon</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={save}
          disabled={saving}
          className="relative group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-fuchsia-600 to-purple-600 rounded-2xl text-white font-bold text-sm shadow-lg shadow-fuchsia-500/20 overflow-hidden disabled:opacity-50"
        >
          <Save size={18} className="relative z-10" />
          <span className="relative z-10">{saving ? 'Syncing...' : 'Save Changes'}</span>
        </motion.button>
      </div>

      <div className="bg-gray-900/30 border border-gray-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm shadow-2xl">
        <div className="p-8 border-b border-gray-800/50 bg-gray-950/20 flex items-center gap-3">
          <Calendar className="text-fuchsia-500" size={20} />
          <h2 className="text-lg font-bold text-white font-display">Weekly Schedule</h2>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-950/40 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                <th className="py-6 px-10">Day of the Week</th>
                <th className="py-6 px-10">Opening (AM)</th>
                <th className="py-6 px-10">Closing (PM)</th>
                <th className="py-6 px-10 text-center">Salon Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {schedules.map((s, i) => (
                <motion.tr 
                  key={s.id} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: i * 0.05 }}
                  className={`group transition-colors ${s.is_active ? 'hover:bg-white/[0.01]' : 'bg-gray-950/20'}`}
                >
                  <td className="py-6 px-10">
                    <div className="flex items-center gap-4">
                      <div className={`w-2 h-2 rounded-full ${s.is_active ? 'bg-fuchsia-500 shadow-[0_0_8px_rgba(233,30,140,0.8)]' : 'bg-gray-800'}`} />
                      <span className={`text-sm font-bold tracking-tight transition-colors ${s.is_active ? 'text-white' : 'text-gray-600'}`}>
                        {dayTranslations[s.day_name] || s.day_name}
                      </span>
                    </div>
                  </td>
                  
                  <td className="py-6 px-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gray-950/50 flex items-center justify-center border border-gray-800 flex-shrink-0 transition-opacity ${!s.is_active && 'opacity-30'}`}>
                        <Sun className={`w-4 h-4 transition-colors ${s.is_active ? 'text-amber-500' : 'text-gray-600'}`} />
                      </div>
                      <input 
                        type="time" 
                        value={s.start_time?.substring(0, 5)} 
                        onChange={e => update(i, 'start_time', e.target.value)} 
                        className={`bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-amber-500 transition-all font-medium w-[110px] ${!s.is_active && 'opacity-30 cursor-not-allowed'}`}
                        disabled={!s.is_active} 
                      />
                    </div>
                  </td>
                  
                  <td className="py-6 px-10">
                    <div className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl bg-gray-950/50 flex items-center justify-center border border-gray-800 flex-shrink-0 transition-opacity ${!s.is_active && 'opacity-30'}`}>
                        <Moon className={`w-4 h-4 transition-colors ${s.is_active ? 'text-purple-500' : 'text-gray-600'}`} />
                      </div>
                      <input 
                        type="time" 
                        value={s.end_time?.substring(0, 5)} 
                        onChange={e => update(i, 'end_time', e.target.value)} 
                        className={`bg-gray-950 border border-gray-800 rounded-xl px-4 py-2.5 text-xs text-white outline-none focus:border-purple-500 transition-all font-medium w-[110px] ${!s.is_active && 'opacity-30 cursor-not-allowed'}`}
                        disabled={!s.is_active} 
                      />
                    </div>
                  </td>
                  
                  <td className="py-6 px-10">
                    <div className="flex justify-center">
                      <label className="relative inline-flex items-center cursor-pointer group">
                        <input 
                          type="checkbox" 
                          checked={s.is_active} 
                          onChange={e => update(i, 'is_active', e.target.checked)} 
                          className="sr-only peer" 
                        />
                        <div className="w-14 h-7 bg-gray-800 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-1 after:left-1 after:bg-gray-400 after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-fuchsia-600 peer-checked:after:bg-white shadow-inner"></div>
                        <div className="ml-4 flex flex-col">
                           <span className={`text-[10px] font-black uppercase tracking-widest transition-colors ${s.is_active ? 'text-fuchsia-400' : 'text-gray-600'}`}>
                             {s.is_active ? 'Open' : 'Closed'}
                           </span>
                        </div>
                      </label>
                    </div>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="p-8 bg-gray-950/40 border-t border-gray-800/50 flex items-center gap-4">
           <div className="p-3 bg-fuchsia-500/10 rounded-2xl border border-fuchsia-500/20">
              <AlertCircle className="text-fuchsia-400" size={20} />
           </div>
           <div>
              <p className="text-white text-sm font-bold font-display">Sync Note</p>
              <p className="text-gray-500 text-xs">Changes to the schedule will immediately affect availability in the client booking portal.</p>
           </div>
        </div>
      </div>
    </div>
  );
}
