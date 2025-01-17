/* import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';

const Header = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');

    // Si no hay usuario logueado, redirige a "/"
    if (!userEmail) {
      navigate('/');
    }
  }, [navigate]);

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/Home">Reserva Aulas</Link> 
      </div>
      <nav className="header-nav">
      </nav>
    </header>
  );
};

export default Header;
 */
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Header.css';
import Sidebar from '../sidebar/Sidebar';  // Importa el Sidebar

const Header = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Estado para controlar el sidebar

  useEffect(() => {
    const userEmail = sessionStorage.getItem('userEmail');

    // Si no hay usuario logueado, redirige a "/"
    if (!userEmail) {
      navigate('/');
    }
  }, [navigate]);

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/Home">HEPTA Aulas</Link>
      </div>
      <nav className="header-nav">
        {/* Agregamos un botón para abrir el Sidebar */}
        <button onClick={toggleSidebar} className="sidebar-toggle-btn">☰</button>
      </nav>

      {/* Sidebar Component */}
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
    </header>
  );
};

export default Header;
