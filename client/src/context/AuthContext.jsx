import { createContext, useEffect, useState } from 'react';
import { loginAPI, meAPI, signupAPI } from '../api/authAPI';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('jwtToken');
    if (!token) { setLoading(false); return; }
    try {
      const { data } = await meAPI();
      setUser(data.user);
    } catch {
      localStorage.removeItem('jwtToken');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadUser(); }, []);

  const login = async (payload) => {
    const { data } = await loginAPI(payload);
    localStorage.setItem('jwtToken', data.token);
    setUser(data.user);
  };

  const signup = async (payload) => {
    const { data } = await signupAPI(payload);
    localStorage.setItem('jwtToken', data.token);
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem('jwtToken');
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, loading, login, signup, logout, setUser }}>{children}</AuthContext.Provider>;
};
