import React from "react";
import "../styles/Login.css";
import { useState } from "react";
import { registrarUsuario } from "../services/registroService";

function Registro() {
  const [passwordMatchError, setPasswordMatchError] = useState("");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repetirPassword, setRepetirPassword] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

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
      const data = { nombre, email, password, fechaNacimiento };
      await registrarUsuario(data);
      setSuccess("¡Registro exitoso! Ahora puedes iniciar sesión.");
      setNombre("");
      setEmail("");
      setPassword("");
      setRepetirPassword("");
      setFechaNacimiento("");
    } catch (err) {
      setError("Error al registrar usuario.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const isFormValid =
    nombre.trim() !== "" &&
    email.trim() !== "" &&
    password.trim() !== "" &&
    repetirPassword.trim() !== "" &&
    fechaNacimiento.trim() !== "" &&
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

        <label htmlFor="email">Correo electrónico</label>
        <input
          type="email"
          id="email"
          name="email"
          placeholder="ejemplo@correo.com"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
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
