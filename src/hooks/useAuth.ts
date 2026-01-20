import { useState } from 'react';
import authService from '../services/authService';
import type { AuthUser } from '../services/authService';

/**
 * Hook para acceder a la información del usuario autenticado
 * @returns {AuthUser | null} Datos del usuario o null si no está autenticado
 */
export const useAuth = () => {
  const [user] = useState<AuthUser | null>(authService.getUser());
  const [loading] = useState(false);
  return { user, loading, isAuthenticated: !!user };
};

/**
 * Hook para manejar logout
 * @returns {() => void} Función para cerrar sesión
 */
export const useLogout = () => {
  return () => {
    authService.logout();
    window.location.href = '/login';
  };
};
