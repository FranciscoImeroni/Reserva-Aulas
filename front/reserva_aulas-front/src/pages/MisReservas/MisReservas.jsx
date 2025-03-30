import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import './MisReservas.css'; 


const MisReservas = () => {
  const [reservas, setReservas] = useState([]); 
  const [loading, setLoading] = useState(true); 
  const [error, setError] = useState(null); 

  useEffect(() => {
    const obtenerReservas = async () => {
      try {
        setLoading(true);
        setError(null);

        const userId = Cookies.get('userId');
        if (!userId) {
          throw new Error('No se encontró el ID del usuario.');
        }

        const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;

        const response = await fetch(`${DOMAIN_BACK}/bookings/user/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error('Error al obtener las reservas');
        }

        const data = await response.json();
        const reservasOrdenadas = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setReservas(reservasOrdenadas);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerReservas();
  }, []);

  const handleDeleteReserva = async (reservaId) => {
    try {
      if (!window.confirm('¿Está seguro de que desea eliminar esta reserva?')) {
        return;
      }

      const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
      const response = await fetch(`${DOMAIN_BACK}/bookings/${reservaId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Error al eliminar la reserva');
      }

      // Remove the deleted reservation from the state
      setReservas(prevReservas => prevReservas.filter(reserva => reserva.id !== reservaId));
      alert('Reserva eliminada correctamente');
    } catch (err) {
      console.error(err);
      alert('Error al eliminar la reserva. Por favor, intente nuevamente.');
    }
  };

  return (
    <div className="mis-reservas-container">
      <h1>Mis Reservas</h1>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="error">{error}</p>
      ) : reservas.length > 0 ? (
        <ul className="reservas-list">
          {reservas.map((reserva) => (
            <li key={reserva.id} className="reserva-item">
              <div>
                <strong>Aula:</strong> {reserva.aulaName}
              </div>
              <div>
                <strong>Actividad:</strong> {reserva.activityName}
              </div>
              <div>
                <strong>Días:</strong> {reserva.reservationDays.join(', ')}
              </div>
              <div>
                <strong>Horas:</strong> {reserva.reservationHours.join(', ')}
              </div>
              <div>
                <strong>Fecha de Creación:</strong>{' '}
                {new Date(reserva.createdAt).toLocaleDateString()}
              </div>
              <button onClick={() => handleDeleteReserva(reserva.id)} className="delete-button">
                Eliminar Reserva
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p>No tienes reservas registradas.</p>
      )}
    </div>
  );
};

export default MisReservas;
