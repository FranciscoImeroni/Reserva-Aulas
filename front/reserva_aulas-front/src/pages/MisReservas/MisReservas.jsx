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

        
       //const userId = "e6b3d031-d5db-46c0-b251-c24327afdca6" LOCALTUNNEL

        const userId = Cookies.get('userId');
        console.log('User ID from cookie:', userId); 

        if (!userId) {
          throw new Error('No se encontró el ID del usuario.');
        }

        const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;

        const response = await fetch(
          `${DOMAIN_BACK}/bookings/user/${userId}`
        );

        if (!response.ok) {
          throw new Error('Error al obtener las reservas');
        }

        const data = await response.json();

        const reservasOrdenadas = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );

        setReservas(reservasOrdenadas);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    obtenerReservas();
  }, []);

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
