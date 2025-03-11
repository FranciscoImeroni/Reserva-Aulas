import React from 'react';
import './Sidebar.css';
import { useNavigate } from 'react-router-dom';

const Sidebar = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });

      if (response.ok) {
        navigate('/');
      } else {
        console.error('Logout failed');
      }
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : ''}`}>
      <div className="sidebar-header">
        <button onClick={onClose} className="close-btn">×</button>
      </div>
      <div className="sidebar-content">
        <ul>
          <li><a href="/home">Home</a></li>
          <li><a href="/MisReservas">Mis reservas</a></li>
          <li><a href="/settings">Perfil</a></li>
          <li><button onClick={handleLogout} className="logout-button">Cerrar sesión</button></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
