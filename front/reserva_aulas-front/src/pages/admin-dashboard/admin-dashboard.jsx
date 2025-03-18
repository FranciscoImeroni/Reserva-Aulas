import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import './admin-dashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [aulas, setAulas] = useState([]); // Add state for aulas
  const [activeTab, setActiveTab] = useState('users');
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [expandedReservations, setExpandedReservations] = useState({});
  const [expandedHours, setExpandedHours] = useState({});

  const toggleDatesExpansion = (reservationId) => {
    setExpandedReservations(prev => ({
      ...prev,
      [reservationId]: !prev[reservationId]
    }));
  };

  const toggleHoursExpansion = (reservationId) => {
    setExpandedHours(prev => ({
      ...prev,
      [reservationId]: !prev[reservationId]
    }));
  };

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
    fetchAulas(); // Fetch aulas data
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
      console.log("Datos recibidos:", data); 

      setReservations(data);
    } catch (error) {
      console.error('Error fetching reservations:', error);
    }
  };

  const fetchAulas = async () => {
    try {
      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      const response = await fetch(`${DOMAIN_BACK}/aulas`, { // Ensure the correct endpoint
        credentials: 'include'
      });
      const data = await response.json();
      setAulas(data);
    } catch (error) {
      console.error('Error fetching aulas:', error);
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

  // Add this function to filter reservations by user
  const getUserReservations = async (userId) => {
    try {
      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      const response = await fetch(`${DOMAIN_BACK}/bookings/user/${userId}`, {
        credentials: 'include'
      });
      const data = await response.json();
      setSelectedUserId(userId === selectedUserId ? null : userId);
      setActiveTab('reservations');
      setReservations(data);
    } catch (error) {
      console.error('Error fetching user reservations:', error);
    }
  };

  const handleDeleteReservation = async (reservationId) => {
    try {
      // Ask for confirmation before deleting
      if (!window.confirm('¿Está seguro de que desea eliminar esta reserva?')) {
        return;
      }

      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      const response = await fetch(`${DOMAIN_BACK}/bookings/${reservationId}`, {
        method: 'DELETE',
        credentials: 'include'
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete reservation');
      }
  
      // Wait a moment before refreshing the data
      await new Promise(resolve => setTimeout(resolve, 100));
  
      // Refresh the reservations list
      if (selectedUserId) {
        await getUserReservations(selectedUserId);
      } else {
        await fetchReservations();
      }
    } catch (error) {
      console.error('Error deleting reservation:', error);
      alert('Error al eliminar la reserva. Por favor, intente nuevamente.');
    }
  };

  // Add this function inside the component
  const handleEditAula = async (aulaId) => {
    try {
      const aula = aulas.find(a => a.id === aulaId);
      const newName = prompt('Ingrese el nuevo nombre del aula:', aula.name);
      const newCapacity = prompt('Ingrese la nueva capacidad del aula:', aula.capacity);
  
      if (!newName || !newCapacity) return;
  
      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      const response = await fetch(`${DOMAIN_BACK}/aulas/${aulaId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          name: newName,
          capacity: parseInt(newCapacity)
        }),
        credentials: 'include'
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update aula');
      }
  
      // Update local state instead of refetching all aulas
      setAulas(prevAulas => prevAulas.map(a => 
        a.id === aulaId ? { ...a, name: newName, capacity: parseInt(newCapacity) } : a
      ));
      
      alert('Aula actualizada correctamente');
    } catch (error) {
      console.error('Error updating aula:', error);
      alert(`Error al actualizar el aula: ${error.message}`);
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
        <button 
          className={`tab-button ${activeTab === 'aulas' ? 'active' : ''}`}
          onClick={() => setActiveTab('aulas')}
        >
          Aulas
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
                <th>Reservas</th>
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
                  <td>
                    <button 
                      onClick={() => getUserReservations(user.id)}
                      className="view-reservations-btn"
                    >
                      Ver reservas
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'reservations' && (
        <div className="reservations-section">
          <h2>
            {selectedUserId ? 
              `Reservas del usuario: ${users.find(u => u.id === selectedUserId)?.email}` : 
              'Gestión de Reservas'
            }
          </h2>
          <table className="reservations-table">
            <thead>
              <tr>
                <th>Aula</th>
                <th>Días</th>
                <th>Horarios</th>
                <th>Variables</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {Array.isArray(reservations) && reservations.length > 0 ? (
                reservations
                  .filter(reservation => !selectedUserId || reservation.user.id === selectedUserId)
                  .map(reservation => (
                    <tr key={reservation.id}>
                      <td>{reservation.aula.name}</td>
                      <td>
                        {reservation.reservationDays.length > 4 && !expandedReservations[reservation.id] ? (
                          <>
                            {reservation.reservationDays.slice(0, 4).map(date => 
                              new Date(date).toLocaleDateString()
                            ).join(', ')}
                            <button 
                              className="show-more-btn"
                              onClick={() => toggleDatesExpansion(reservation.id)}
                            >
                              Ver todo ({reservation.reservationDays.length})
                            </button>
                          </>
                        ) : (
                          <>
                            {reservation.reservationDays.map(date => 
                              new Date(date).toLocaleDateString()
                            ).join(', ')}
                            {reservation.reservationDays.length > 4 && (
                              <button 
                                className="show-less-btn"
                                onClick={() => toggleDatesExpansion(reservation.id)}
                              >
                                Ver menos
                              </button>
                            )}
                          </>
                        )}
                      </td>
                      <td>
                        {reservation.reservationHours.length > 6 && !expandedHours[reservation.id] ? (
                          <>
                            {reservation.reservationHours.slice(0, 6).join(', ')}
                            <button 
                              className="show-more-btn"
                              onClick={() => toggleHoursExpansion(reservation.id)}
                            >
                              Ver todo ({reservation.reservationHours.length})
                            </button>
                          </>
                        ) : (
                          <>
                            {reservation.reservationHours.join(', ')}
                            {reservation.reservationHours.length > 6 && (
                              <button 
                                className="show-less-btn"
                                onClick={() => toggleHoursExpansion(reservation.id)}
                              >
                                Ver menos
                              </button>
                            )}
                          </>
                        )}
                      </td>
                      <td>{reservation.selectedVariables.join(', ')}</td>
                      <td>
                        <button 
                          onClick={() => handleDeleteReservation(reservation.id)}
                          className="delete-reservation-btn"
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                ))
            ) : (
              <tr><td colSpan="5">No hay reservas</td></tr>
            )}
          </tbody>
        </table>
      </div>
    )}

    {activeTab === 'aulas' && (
      <div className="aulas-section">
        <h2>Gestión de Aulas</h2>
        <table className="aulas-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {aulas.map(aula => (
              <tr key={aula.id}>
                <td>{aula.name}</td>
                <td>{aula.capacity}</td>
                <td>
                  <button 
                    onClick={() => handleEditAula(aula.id)} 
                    className="edit-btn"
                  >
                    Editar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )}
  </div>
  );
};

// Remove the external handleEditAula function from here
export default AdminDashboard;