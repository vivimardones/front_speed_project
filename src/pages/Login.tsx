import React, { useState } from 'react';
import axios from 'axios';
import { logError } from '../utils/errorLogger';
import '../styles/Login.css';


interface LoginResponse {
  token: string;
  // agrega más campos si tu API devuelve otros datos
}

const Login: React.FC = () => {
  const [correo, setCorreo] = useState<string>('');
  const [contrasena, setContrasena] = useState<string>('');
  const [error, setError] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post<LoginResponse>('https://tu-api.com/login', {
        email: correo,
        password: contrasena,
      });

      localStorage.setItem('token', response.data.token);
      window.location.href = '/dashboard';
    } catch (err) {
        logError(err, 'Login attempt failed');
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit}>
        <label>Correo</label>
        <input
          type="email"
          value={correo}
          onChange={(e) => setCorreo(e.target.value)}
          required
        />

        <label>Contraseña</label>
        <input
          type="password"
          value={contrasena}
          onChange={(e) => setContrasena(e.target.value)}
          required
        />

        {error && <p className="error">{error}</p>}

        <button type="submit">Acceder</button>
        <a href="/recuperar">¿Olvidaste tu contraseña?</a>
      </form>
    </div>
  );
};

export default Login;
