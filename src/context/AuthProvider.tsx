import React, { useState, useEffect } from 'react';
import { auth } from '../services/api';
import api from '../services/api';
import { AuthContext } from './auth.context';
import { AuthContextType, User } from './auth.types';

export const AuthProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [user, setUser] = useState<AuthContextType['user']>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = auth.getCurrentUser();
    if (token) {
      // Fetch user data using the token
      api
        .get<{ user: User }>('/users/me')
        .then((response) => {
          setUser(response.data.user);
        })
        .catch(() => {
          localStorage.removeItem('token');
          setUser(null);
        });
    }
    setIsLoading(false);
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
