import React, { useState, useEffect, type ReactNode } from 'react';
import authService from '../services/authService';
import type { AuthUser } from '../services/authService';
import { AuthContext, type AuthContextType } from './auth.context';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  // Verificar si hay sesión activa al montar
  useEffect(() => {
    const savedUser = authService.getUser();
    if (savedUser) {
      setUser(savedUser);
    }
    setLoading(false);
  }, []);

  // Escuchar cambios de autenticación desde el servicio
  useEffect(() => {
    const handleAuthUpdate = (event: Event) => {
      const customEvent = event as CustomEvent<AuthUser>;
      setUser(customEvent.detail);
    };

    window.addEventListener('authUpdate', handleAuthUpdate);
    return () => window.removeEventListener('authUpdate', handleAuthUpdate);
  }, []);

  const login = async (correo: string, password: string) => {
    setLoading(true);
    try {
      const response = await authService.login({ correo, password });
      setUser(response);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
