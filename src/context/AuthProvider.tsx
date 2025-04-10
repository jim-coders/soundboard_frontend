import { useState, useEffect, ReactNode } from 'react';
import { User } from 'types';
import { AuthContext } from './AuthContext';
import { auth } from '../services/api';
import api from '../services/api';

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = auth.getCurrentUser();
        if (token) {
          const response = await api.get<User>('/users/me');
          setUser(response.data);
        }
      } catch {
        localStorage.removeItem('token');
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const response = await auth.login(email, password);
    setUser(response.user);
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ) => {
    const response = await auth.signup(username, email, password);
    setUser(response.user);
  };

  const logout = async () => {
    await auth.logout();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
