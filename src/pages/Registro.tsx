import React from "react";
import "../styles/Login.css";
import { useState } from "react";
import { registrarUsuario } from "../services/registroService";
import { useAuth } from "../hooks/useAuth";

function Registro() {
  const { user: currentUser } = useAuth();
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [rol, setRol] = useState("deportista");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const isAdmin = currentUser?.roles?.includes("admin");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (password !== repetirPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }
    setLoading(true);
    try {
      const data = { nombre, correo, password, fechaNacimiento, idRol: rol };
      await registrarUsuario(data);
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setNombre("");
      setCorreo("");
      setPassword("");
      setRepetirPassword("");
      setFechaNacimiento("");
      setRol("deportista");
    } catch (err) {
      setError("Error al registrar usuario.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    nombre.trim() !== "" &&
    correo.trim() !== "" &&
    password.trim() !== "" &&
    repetirPassword.trim() !== "" &&
    fechaNacimiento.trim() !== "" &&
    rol.trim() !== "" &&
    password === repetirPassword &&
    !passwordMatchError &&
    !error;

  return (
    <div className="login-container">
      <h2>Crear Cuenta</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="nombre">Nombre</label>
        <input
          type="text"
          id="nombre"
          name="nombre"
          placeholder="Tu nombre"
          required
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          disabled={loading}
        />

        <label htmlFor="correo">Correo electrónico</label>
        <input
          type="email"
          id="correo"
          name="correo"
          placeholder="ejemplo@correo.com"
          required
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          disabled={loading}
        />

        <label htmlFor="password">Contraseña</label>
        <input
          type="password"
          id="password"
          name="password"
          placeholder="Contraseña"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
        />

        <label htmlFor="repetirPassword">Repetir Contraseña</label>
        <input
          type="password"
          id="repetirPassword"
          name="repetirPassword"
          placeholder="Repite la contraseña"
          required
          value={repetirPassword}
          onChange={(e) => {
            setRepetirPassword(e.target.value);
            if (passwordMatchError) setPasswordMatchError("");
          }}
          onBlur={() => {
            if (password && repetirPassword && password !== repetirPassword) {
              setPasswordMatchError("Las contraseñas no coinciden.");
            } else {
              setPasswordMatchError("");
            }
          }}
          disabled={loading}
        />
        {passwordMatchError && <p className="error">{passwordMatchError}</p>}

        <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
        <input
          type="date"
          id="fechaNacimiento"
          name="fechaNacimiento"
          required
          value={fechaNacimiento}
          onChange={(e) => setFechaNacimiento(e.target.value)}
          disabled={loading}
        />
        <label htmlFor="rol">Elegir Rol</label>
        <select
          id="rol"
          name="rol"
          required
          value={rol}
          onChange={(e) => setRol(e.target.value)}
          disabled={loading}
          style={{
            padding: "0.75rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        >
          {isAdmin && <option value="admin">Administrador</option>}
          <option value="deportista">Deportista</option>
          <option value="apoderado">Apoderado</option>
        </select>

        {error && <p className="error">{error}</p>}
        {success && (
          <p style={{ color: "green", marginTop: "1rem", textAlign: "center" }}>
            {success}
          </p>
        )}

        <button type="submit" disabled={loading || !isFormValid}>
          {loading ? "Registrando..." : "Registrarse"}
        </button>
      </form>
    </div>
  );
}

export default Registro;
