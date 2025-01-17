import React from 'react';
import './Sidebar.css';  // Añadimos un archivo de estilo para el Sidebar

const Sidebar = ({ isOpen, onClose }) => {
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
          <li><a href="/logout">Cerrar sesión</a></li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
