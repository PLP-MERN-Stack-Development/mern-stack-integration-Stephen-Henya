import { useState, useEffect } from 'react';
import { AuthContext } from './AuthContext';
import { authService } from '../services/api';

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const u = localStorage.getItem('user');
    return u ? JSON.parse(u) : null;
  });

  useEffect(() => {
    if (user) localStorage.setItem('user', JSON.stringify(user));
    else localStorage.removeItem('user');
  }, [user]);

  const login = async (credentials) => {
    const res = await authService.login(credentials);
    const u = res.user || authService.getCurrentUser();
    setUser(u);
    return res;
  };

  const register = async (payload) => {
    const res = await authService.register(payload);
    const u = res.user || authService.getCurrentUser();
    setUser(u);
    return res;
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
