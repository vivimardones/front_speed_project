import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: string[];
  redirectTo?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  roles,
  redirectTo = "/login",
}) => {
  const { user, loading, isAuthenticated } = useAuth();

  // Mostrar loading mientras verifica autenticación
  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <p>Cargando...</p>
      </div>
    );
  }

  // Si no está autenticado, redirigir a login
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Si se requieren roles específicos, verificar
  if (roles && roles.length > 0) {
    const hasRequiredRole = user?.roles?.some((userRole) =>
      roles.includes(userRole),
    );

    if (!hasRequiredRole) {
      // Usuario autenticado pero sin permisos
      return <Navigate to="/acceso-denegado" replace />;
    }
  }

  // Todo OK, renderizar contenido
  return <>{children}</>;
};

export default ProtectedRoute;
