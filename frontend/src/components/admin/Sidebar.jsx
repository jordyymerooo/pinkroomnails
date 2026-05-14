import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutDashboard, 
  Calendar, 
  Scissors, 
  Image as ImageIcon, 
  Clock, 
  LogOut, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const links = [
  { to: '/admin', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/admin/appointments', icon: Calendar, label: 'Appointments' },
  { to: '/admin/services', icon: Scissors, label: 'Services' },
  { to: '/admin/gallery', icon: ImageIcon, label: 'Gallery' },
  { to: '/admin/schedule', icon: Clock, label: 'Schedule' },
];

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = async () => { 
    await logout(); 
    navigate('/admin/login'); 
  };

  const sidebarContent = (
    <div className="flex flex-col h-full">
      {/* Logo Section */}
      <div className="p-6 border-b border-gray-800/50 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-pink-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-pink-500/20">
              <Sparkles className="text-white w-6 h-6" />
            </div>
            <div>
              <h2 className="text-white font-bold font-display text-lg tracking-tight">PinkRoom</h2>
              <p className="text-pink-400/60 text-[10px] font-medium uppercase tracking-widest -mt-1">Admin Studio</p>
            </div>
          </div>
          <button onClick={() => setMobileOpen(false)} className="lg:hidden text-gray-500 hover:text-white p-1 transition-colors">
            <X size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto scrollbar-hide">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.end}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) => `
              relative group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300
              ${isActive 
                ? 'text-white bg-gradient-to-r from-pink-900/40 to-transparent' 
                : 'text-gray-500 hover:text-gray-300 hover:bg-gray-800/30'}
            `}
          >
            {({ isActive }) => (
              <>
                <motion.div
                  whileHover={{ x: 5 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex items-center gap-3 w-full"
                >
                  <link.icon className={`w-5 h-5 transition-colors ${isActive ? 'text-pink-400' : 'group-hover:text-cyan-400'}`} />
                  <span className="truncate">{link.label}</span>
                </motion.div>
                
                {isActive && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute left-0 top-1/4 bottom-1/4 w-[2px] bg-pink-400 rounded-full shadow-[0_0_10px_rgba(255,61,168,0.8)]"
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User & Logout Section */}
      <div className="p-4 border-t border-gray-800/50 flex-shrink-0 bg-gray-950/40">
        <div className="flex items-center gap-3 p-2 mb-3 bg-gray-900/40 rounded-2xl border border-gray-800/30">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-800 to-gray-900 flex items-center justify-center border border-gray-700/50 shadow-inner overflow-hidden">
            <span className="text-pink-400 font-bold text-sm">{user?.name?.charAt(0) || 'A'}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-gray-200 text-xs font-semibold truncate">{user?.name}</p>
            <p className="text-gray-500 text-[10px] truncate">{user?.email}</p>
          </div>
        </div>
        
        <motion.button
          whileHover={{ x: 3 }}
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-semibold text-gray-500 hover:text-red-400 hover:bg-red-500/5 transition-all duration-300"
        >
          <LogOut size={16} />
          <span>Logout</span>
        </motion.button>
      </div>
    </div>
  );

  return (
    <>
      {/* Mobile Header (Only on smaller screens) */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-gray-950/80 backdrop-blur-md border-b border-gray-800 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="text-pink-400 w-5 h-5" />
          <span className="text-white font-bold font-display text-base tracking-tight">PinkRoom Admin</span>
        </div>
        <button onClick={() => setMobileOpen(true)} className="text-gray-400 hover:text-white p-1">
          <Menu size={24} />
        </button>
      </div>

      {/* Desktop Sidebar (Permanent on lg+) */}
      <aside className="hidden lg:flex w-64 h-screen bg-gray-950/80 backdrop-blur-xl border-r border-gray-800 flex-col sticky top-0 left-0 z-30 overflow-y-auto scrollbar-hide shrink-0">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay) */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="lg:hidden fixed inset-0 z-50 overflow-hidden"
          >
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute left-0 top-0 h-full w-[280px] bg-gray-950 border-r border-gray-800 flex-col shadow-2xl overflow-hidden"
            >
              {sidebarContent}
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
