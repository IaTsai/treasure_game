import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiPost, apiGet, setToken, clearToken, getToken } from '@/lib/api';

interface User {
  id: number;
  username: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isGuest: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  loginAsGuest: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isGuest, setIsGuest] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiGet<User>('/api/auth/me')
      .then(setUser)
      .catch(() => clearToken())
      .finally(() => setLoading(false));
  }, []);

  const login = async (username: string, password: string) => {
    const data = await apiPost<{ token: string; user: User }>('/api/auth/login', { username, password });
    setToken(data.token);
    setUser(data.user);
  };

  const register = async (username: string, password: string) => {
    const data = await apiPost<{ token: string; user: User }>('/api/auth/register', { username, password });
    setToken(data.token);
    setUser(data.user);
  };

  const loginAsGuest = () => {
    setUser({ id: -1, username: 'Guest' });
    setIsGuest(true);
  };

  const logout = () => {
    clearToken();
    setUser(null);
    setIsGuest(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isGuest, login, register, loginAsGuest, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
