'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import Cookies from 'js-cookie';
import api from '@/lib/api';

interface User {
  id: string;
  name: string;
  email: string;
  isEmailVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  googleLogin: () => Promise<void>;
  facebookLogin: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = Cookies.get('token');
    if (token) {
      try {
        const res = await api.get('/auth/profile');
        setUser(res.data);
      } catch {
        Cookies.remove('token');
      }
    }
    setLoading(false);
  };

  const login = async (email: string, password: string) => {
    const res = await api.post('/auth/login', { email, password });
    Cookies.set('token', res.data.accessToken, { expires: 7 });
    setUser(res.data.user);
  };

  const signup = async (name: string, email: string, password: string) => {
    const res = await api.post('/auth/signup', { name, email, password });
    Cookies.set('token', res.data.accessToken, { expires: 7 });
    setUser(res.data.user);
  };

  const logout = () => {
    Cookies.remove('token');
    setUser(null);
  };

  const googleLogin = async () => {
    const res = await api.get('/auth/google');
    Cookies.set('token', res.data.accessToken, { expires: 7 });
    setUser(res.data.user);
  };

  const facebookLogin = async () => {
    const res = await api.get('/auth/facebook');
    Cookies.set('token', res.data.accessToken, { expires: 7 });
    setUser(res.data.user);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, googleLogin, facebookLogin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
}

