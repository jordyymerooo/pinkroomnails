import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    const savedUser = localStorage.getItem('admin_user');
    
    if (token && savedUser) {
      setUser(JSON.parse(savedUser));
      // Verificar que el token siga siendo válido
      api.get('/admin/me')
        .then(res => {
          setUser(res.data.user);
          localStorage.setItem('admin_user', JSON.stringify(res.data.user));
        })
        .catch(() => {
          localStorage.removeItem('admin_token');
          localStorage.removeItem('admin_user');
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const response = await api.post('/admin/login', { email, password });
    const { user, token } = response.data;
    
    localStorage.setItem('admin_token', token);
    localStorage.setItem('admin_user', JSON.stringify(user));
    setUser(user);
    
    return response.data;
  };

  const logout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (e) {
      // Token puede haber expirado
    }
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
}
