import { useState, useEffect, ReactNode } from 'react';
import { User } from 'types';
import { AuthContext } from './AuthContext';
import { auth } from '../services/api';

export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const controller = new AbortController();

    const initializeAuth = async () => {
      try {
        const userData = await auth.getCurrentUser();
        if (!controller.signal.aborted) {
          setUser(userData);
        }
      } catch {
        if (!controller.signal.aborted) {
          setUser(null);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    initializeAuth();

    return () => controller.abort();
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await auth.login(email, password);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (
    username: string,
    email: string,
    password: string
  ) => {
    setIsLoading(true);
    try {
      const response = await auth.signup(username, email, password);
      setUser(response.user);
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await auth.logout();
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isLoading, login, signup, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
