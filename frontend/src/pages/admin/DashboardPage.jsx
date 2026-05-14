import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Users, 
  Sparkles,
  ArrowUpRight,
  User
} from 'lucide-react';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../../api/axios';

const statIcons = [Calendar, Clock, DollarSign, TrendingUp];
const statColors = [
  'from-fuchsia-500 to-purple-600', 
  'from-amber-400 to-orange-500', 
  'from-emerald-500 to-teal-600', 
  'from-blue-500 to-indigo-600'
];

const formatLongDate = (dateStr) => {
  if (!dateStr) return '---';
  try {
    const date = new Date(dateStr);
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

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/admin/dashboard').then(res => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="loader-nail" />
    </div>
  );
  
  if (!data) return (
    <div className="text-center py-20 bg-gray-900/30 border border-gray-800 rounded-[2.5rem] backdrop-blur-sm">
      <Sparkles className="w-12 h-12 text-gray-800 mx-auto mb-4" />
      <p className="text-gray-500 font-medium">Error loading dashboard overview</p>
    </div>
  );

  const stats = [
    { label: 'Monthly Appointments', value: data.stats.monthly_appointments, icon: Calendar },
    { label: 'Pending', value: data.stats.pending_appointments, icon: Clock },
    { label: 'Monthly Revenue', value: `$${data.stats.monthly_revenue}`, icon: DollarSign },
    { label: 'Top Service', value: data.stats.popular_service, icon: Sparkles },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div>
        <h1 className="text-3xl font-bold text-white font-display tracking-tight">Overview</h1>
        <p className="text-gray-500 text-sm mt-1">Monitor the growth and shine of your salon</p>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -5 }}
              className="group bg-gray-900/50 border border-gray-800 rounded-[2rem] p-8 backdrop-blur-sm transition-all duration-300 hover:border-gray-700 hover:shadow-2xl hover:shadow-fuchsia-500/5"
            >
              <div className="flex items-center justify-between mb-6">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${statColors[i]} flex items-center justify-center shadow-lg shadow-black/20 group-hover:scale-110 transition-transform duration-500`}>
                  <Icon className="text-white w-7 h-7" />
                </div>
                <div className="text-emerald-400 p-2 bg-emerald-500/10 rounded-lg">
                  <ArrowUpRight size={14} />
                </div>
              </div>
              <div>
                <p className="text-2xl sm:text-3xl font-bold text-white font-display truncate mb-1">{stat.value}</p>
                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Analytical Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.4 }} 
          className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-8 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-white font-display">Appointment Flow</h3>
            <div className="px-4 py-1 bg-fuchsia-500/10 text-fuchsia-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-fuchsia-500/20">
              Weekly
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.charts.weekly_appointments}>
                <defs>
                  <linearGradient id="colorCitas" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#E91E8C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#E91E8C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2E4A" vertical={false} />
                <XAxis dataKey="week" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0F0F1A', border: '1px solid #1F2937', borderRadius: 16, color: '#fff', fontSize: '11px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  itemStyle={{ color: '#E91E8C' }}
                />
                <Area type="monotone" dataKey="citas" stroke="#E91E8C" fillOpacity={1} fill="url(#colorCitas)" strokeWidth={4} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }} 
          animate={{ opacity: 1, scale: 1 }} 
          transition={{ delay: 0.5 }} 
          className="bg-gray-900/50 border border-gray-800 rounded-[2.5rem] p-8 backdrop-blur-sm"
        >
          <div className="flex items-center justify-between mb-10">
            <h3 className="text-xl font-bold text-white font-display">Revenue Growth</h3>
            <div className="px-4 py-1 bg-purple-500/10 text-purple-400 text-[10px] font-bold uppercase tracking-widest rounded-full border border-purple-500/20">
              Monthly
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.charts.monthly_revenue}>
                <CartesianGrid strokeDasharray="3 3" stroke="#2E2E4A" vertical={false} />
                <XAxis dataKey="month" stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#4B5563" fontSize={10} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ background: '#0F0F1A', border: '1px solid #1F2937', borderRadius: 16, color: '#fff', fontSize: '11px', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                  cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                />
                <Bar dataKey="ingresos" fill="url(#barGradient)" radius={[8, 8, 0, 0]} barSize={32} />
                <defs>
                  <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#D946EF" />
                    <stop offset="100%" stopColor="#E91E8C" />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </motion.div>
      </div>

      {/* Recent Activity Table */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ delay: 0.6 }} 
        className="bg-gray-900/30 border border-gray-800 rounded-[2.5rem] overflow-hidden backdrop-blur-sm"
      >
        <div className="p-8 border-b border-gray-800/50 flex items-center justify-between bg-gray-950/20">
          <div>
            <h3 className="text-xl font-bold text-white font-display">Recent Activity</h3>
            <p className="text-gray-500 text-xs mt-1 font-medium">Last 10 booked appointments</p>
          </div>
          <motion.button 
            whileHover={{ x: 3 }}
            className="flex items-center gap-2 text-fuchsia-400 text-xs font-bold uppercase tracking-widest hover:text-fuchsia-300 transition-colors"
          >
            View Full Log <ArrowUpRight size={16} />
          </motion.button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="bg-gray-950/40 text-[10px] font-bold uppercase tracking-widest text-gray-600">
                <th className="py-5 px-8">Client</th>
                <th className="py-5 px-8">Service</th>
                <th className="py-5 px-8">Date & Time</th>
                <th className="py-5 px-8">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-800/30">
              {data.recent_appointments.map((a, i) => (
                <tr key={a.id} className="hover:bg-white/[0.01] transition-colors group">
                  <td className="py-5 px-8">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-gray-950 border border-gray-800 flex items-center justify-center text-gray-500 group-hover:border-fuchsia-500/50 transition-colors">
                        <User size={16} />
                      </div>
                      <span className="text-white font-bold tracking-tight">{a.client_name}</span>
                    </div>
                  </td>
                  <td className="py-5 px-8">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-gray-950/50 border border-gray-800 rounded-lg text-[11px] text-gray-300 font-medium">
                      <Sparkles size={10} className="text-fuchsia-500" />
                      {a.service?.name}
                    </div>
                  </td>
                  <td className="py-5 px-8 text-gray-400 font-medium text-xs">
                    <span className="text-gray-200 capitalize">{formatLongDate(a.appointment_date)}</span>
                    <span className="mx-2 text-gray-700">|</span>
                    <span className="text-fuchsia-500/70 font-bold">{a.appointment_time}</span>
                  </td>
                  <td className="py-5 px-8">
                    <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter border ${
                      a.status === 'pending' ? 'bg-amber-900/20 text-amber-500 border-amber-900/30' :
                      a.status === 'confirmed' ? 'bg-emerald-900/20 text-emerald-500 border-emerald-900/30' :
                      a.status === 'completed' ? 'bg-fuchsia-900/20 text-fuchsia-500 border-fuchsia-900/30' :
                      'bg-rose-900/20 text-rose-500 border-rose-900/30'
                    }`}>
                      {a.status === 'pending' ? 'Pending' : a.status === 'confirmed' ? 'Confirmed' : a.status === 'completed' ? 'Completed' : 'Cancelled'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
