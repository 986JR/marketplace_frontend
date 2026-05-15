import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';

interface User {
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (accessToken: string, refreshToken: string) => void;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [loading, setLoading] = useState(true);

  const login = (accessToken: string, refreshToken: string) => {
    localStorage.setItem('accessToken', accessToken);
    localStorage.setItem('refreshToken', refreshToken);
    setToken(accessToken);
  };

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    setToken(null);
    setUser(null);
  };

  useEffect(() => {
    let finished = false;
    const guard = setTimeout(() => {
      if (!finished) {
        setLoading(false);
      }
    }, 10000);

    if (token) {
      api.get('/auth/me')
        .then(res => {
          setUser(res.data.data);
        })
        .catch(() => {
          logout();
        })
        .finally(() => {
          finished = true;
          clearTimeout(guard);
          setLoading(false);
        });
    } else {
      finished = true;
      clearTimeout(guard);
      setLoading(false);
    }

    return () => {
      finished = true;
      clearTimeout(guard);
    };
  }, [token]);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
