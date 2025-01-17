import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './Login.css';


const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }
    try {
      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      const response = await axios.post(
        `${DOMAIN_BACK}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
    
      // Extraer user y token de la respuesta
      const { token, user } = response.data;
    
      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userRole', user.role);
      sessionStorage.setItem('userEmail', user.email);
    
    
      navigate('/home');
    } catch (error) {
      setError(
        error.response?.data?.message || 'Error al iniciar sesión. Inténtalo de nuevo.'
      );
    }
    
  };


  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button">Iniciar Sesión</button>
        <p className="redirect-text">
          ¿No tienes una cuenta?{' '}
          <span onClick={() => navigate('/register')} className="link-text">
            Crea una aquí
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;


/* import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/reservation/authSlice'; // Asegúrate de que esta importación sea correcta
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Manejo del formulario
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validación básica
    if (!email || !password) {
      setError('Por favor, completa todos los campos.');
      return;
    }

    try {
      const response = await axios.post(
        'http://localhost:3000/auth/login',
        { email, password },
        { withCredentials: true }
      );

      // Extraer datos importantes del servidor
      const { token, user } = response.data;

      // Guardar en localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('userEmail', user.email);

      // Despachar al estado global
      dispatch(setUser({ user, token }));

      // Redirigir a la página de inicio
      navigate('/home');
    } catch (err) {
      console.error('Error de inicio de sesión:', err);

      // Manejar errores de manera específica
      if (err.response) {
        setError(err.response.data.message || 'Error en la autenticación.');
      } else {
        setError('Servidor no disponible. Inténtalo más tarde.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Iniciar Sesión</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <div className="form-group">
          <label htmlFor="email">Correo Electrónico:</label>
          <input
            type="email"
            id="email"
            placeholder="Ingresa tu correo"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="password">Contraseña:</label>
          <input
            type="password"
            id="password"
            placeholder="Ingresa tu contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {error && <p className="error-message">{error}</p>}

        <button type="submit" className="login-button">
          Iniciar Sesión
        </button>
        <p className="redirect-text">
          ¿No tienes una cuenta?{' '}
          <span
            onClick={() => navigate('/register')}
            className="link-text"
            role="button"
          >
            Crea una aquí
          </span>
        </p>
      </form>
    </div>
  );
};

export default Login;
 */