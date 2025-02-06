import React, { useEffect, useState, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './Header.css';
import Sidebar from '../sidebar/Sidebar';  // Importa el Sidebar

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);  // Estado para controlar el sidebar

  // Mover isAuthRoute a useCallback para memoizar la función
  const isAuthRoute = useCallback(() => {
    return location.pathname === '/' || location.pathname === '/register';
  }, [location.pathname]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token && !isAuthRoute()) {
      navigate('/');
    }
  }, [navigate, location, isAuthRoute]);

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
