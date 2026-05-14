import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiMail, HiLockClosed, HiEye, HiEyeOff } from 'react-icons/hi';
import { Flower2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      navigate('/admin');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[100dvh] flex items-center justify-center px-4 py-8 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0A1A1F, #0F2A2E, #183840)' }}>
      <motion.div className="absolute top-10 sm:top-20 left-5 sm:left-20 w-48 sm:w-72 h-48 sm:h-72 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #E91E8C, transparent)' }}
        animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 6, repeat: Infinity }} />
      <motion.div className="absolute bottom-10 sm:bottom-20 right-5 sm:right-20 w-40 sm:w-56 h-40 sm:h-56 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #00BCD4, transparent)' }}
        animate={{ scale: [1.2, 1, 1.2] }} transition={{ duration: 5, repeat: Infinity }} />
      <motion.div initial={{ opacity: 0, y: 30, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: 0.6 }}
        className="glass-dark rounded-2xl sm:rounded-3xl p-6 sm:p-8 lg:p-10 w-full max-w-md relative z-10">
        <div className="text-center mb-6 sm:mb-8">
          <motion.div className="flex justify-center mb-3 sm:mb-4" animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }}>
            <Flower2 className="text-pink-500 w-12 h-12 sm:w-16 sm:h-16" />
          </motion.div>
          <h1 className="text-xl sm:text-2xl font-bold text-white font-display">PinkRoom</h1>
          <p className="text-gray-400 text-xs sm:text-sm mt-1">Admin Panel</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Email</label>
            <div className="relative">
              <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@glamournails.com"
                className="admin-input pl-11" required />
            </div>
          </div>
          <div>
            <label className="text-sm text-gray-400 mb-2 block">Password</label>
            <div className="relative">
              <HiLockClosed className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
              <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••"
                className="admin-input pl-11 pr-11" required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                {showPassword ? <HiEyeOff /> : <HiEye />}
              </button>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} type="submit" disabled={loading}
            className="w-full btn-primary justify-center py-3.5 text-base">
            {loading ? 'Logging in...' : 'Login'}
          </motion.button>
        </form>
        <p className="text-center text-gray-600 text-xs mt-6">Restricted to authorized personnel only</p>
      </motion.div>
    </div>
  );
}
