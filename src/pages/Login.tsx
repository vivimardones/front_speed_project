import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { logError } from '../utils/errorLogger';
import '../styles/Login.css';

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authService.login({
        email: email.trim(),
        password: contrasena,
      });

      navigate('/inicio');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al iniciar sesión';
      setError(errorMessage);
      logError(err, 'Login attempt failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <label> Correo</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Ingresa tu correo"
          required
          disabled={loading}
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          placeholder="Ingresa tu contraseña"
          required
          disabled={loading}
        />

        {error && <p className="error">{error}</p>}

        <button type="submit" disabled={loading}>
          {loading ? 'Conectando...' : 'Acceder'}
        </button>
        <div style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <a href="/recuperar">¿Olvidaste tu contraseña?</a>
          <a href="/registro" style={{ color: '#1976d2', fontWeight: 'bold' }}>¿No tienes cuenta? Crear cuenta</a>
        </div>
      </form>
    </div>
  );
};

export default Login;
