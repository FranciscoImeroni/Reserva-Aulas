import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import jwt_decode from 'jwt-decode';
import './Header.css';
import Sidebar from '../sidebar/Sidebar';  // Importa el Sidebar

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Estado para controlar el sidebar

  const isAuthRoute = () => {
    return location.pathname === '/' || location.pathname === '/register';
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !isAuthRoute()) {
      navigate('/');
    }
  }, [navigate, location]);

  // Función para alternar el estado del sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <header className="header">
      <div className="header-logo">
        <Link to="/Home">HEPTA Aulas</Link>
      </div>
      {!isAuthRoute() && (
        <>
          <nav className="header-nav">
            {/* Agregamos un botón para abrir el Sidebar */}
            <button onClick={toggleSidebar} className="sidebar-toggle-btn">☰</button>
          </nav>
          <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
        </>
      )}
    </header>
  );
};

export default Header;
