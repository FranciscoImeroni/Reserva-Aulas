import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [activeTab, setActiveTab] = useState('users');

  useEffect(() => {
    // Verificar si el usuario es admin
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/');
      return;
    }

    const decodedToken = jwtDecode(token);
    if (decodedToken.role !== 'admin') {
      navigate('/home');
      return;
    }

    // Cargar datos iniciales
    fetchUsers();
    fetchReservations();
  }, [navigate]);

  const fetchUsers = async () => {
    try {
      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      const response = await fetch(`${DOMAIN_BACK}/user`, {
        credentials: 'include'
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchReservations = async () => {
    try {
      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      const response = await fetch(`${DOMAIN_BACK}/bookings`, {
        credentials: 'include'
      });
      const data = await response.json();
      console.log("Datos recibidos:", data); // <-- Agrega esto

      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const handleChangeRole = async (userId, newRole) => {
    try {
      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      await fetch(`${DOMAIN_BACK}/user/change-role/${userId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ role: newRole }),
        credentials: 'include'
      });
      fetchUsers();
    } catch (error) {
      console.error('Error changing role:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      
      <div className="dashboard-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Usuarios
        </button>
        <button 
          className={`tab-button ${activeTab === 'reservations' ? 'active' : ''}`}
          onClick={() => setActiveTab('reservations')}
        >
          Reservas
        </button>
      </div>

      {activeTab === 'users' && (
        <div className="users-section">
          <h2>Gestión de Usuarios</h2>
          <table className="users-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Rol</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id} className={user.role === 'suspended' ? 'suspended-user' : ''}>
                  <td>{user.email}</td>
                  <td>{user.role}</td>
                  <td className="action-buttons">
                    <select
                      value={user.role}
                      onChange={(e) => handleChangeRole(user.id, e.target.value)}
                      className={`role-select ${user.role}`}
                    >
                      <option value="user">Usuario</option>
                      <option value="admin">Administrador</option>
                      <option value="suspended">Suspendido</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="reservations-section">
          <h2>Gestión de Reservas</h2>
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Usuario</th>
                <th>Aula</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
            {Array.isArray(reservations) && reservations.length > 0 ? (
  reservations.map(reservation => (
    <tr key={reservation.id}>
      <td>{reservation.user.email}</td>
      <td>{reservation.aula.name}</td>
      <td>{new Date(reservation.date).toLocaleDateString()}</td>
      <td>{reservation.status}</td>
    </tr>
  ))
) : (
  <tr><td colSpan="4">No hay reservas</td></tr>
)}

            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;