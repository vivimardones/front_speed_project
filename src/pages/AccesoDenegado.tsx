import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const AccesoDenegado: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "60vh",
        padding: "2rem",
        textAlign: "center",
      }}
    >
      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>403</h1>
      <h2 style={{ marginBottom: "1rem" }}>Acceso Denegado</h2>
      <p style={{ marginBottom: "0.5rem", color: "#666" }}>
        No tienes permisos para acceder a esta página.
      </p>
      {user?.roles && user.roles.length > 0 && (
        <p style={{ marginBottom: "2rem", color: "#888", fontSize: "0.9rem" }}>
          Tus roles actuales: <strong>{user.roles.join(", ")}</strong>
        </p>
      )}
      <button
        onClick={() => navigate("/inicio")}
        style={{
          padding: "0.75rem 2rem",
          fontSize: "1rem",
          backgroundColor: "#007bff",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Volver al Inicio
      </button>
    </div>
  );
};

export default AccesoDenegado;
