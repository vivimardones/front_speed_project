import { useContext } from 'react';
import { AuthContext } from '../context/auth.context';
import type { AuthContextType } from '../context/auth.context';
import authService from '../services/authService';

/**
 * Hook para acceder a la información del usuario autenticado
 * @returns {AuthContextType} Datos de autenticación
 */
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
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
