/* import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReservation } from '../../features/reservation/reservationSlice';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './confirmation.css';


const Confirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { aulaId } = useParams();


  // Acceder a los datos de la reserva desde Redux
  const {
    activityName,
    selectedVariables,
    reservationDays,
    reservationHours,
    aulaName,
  } = useSelector((state) => state.reservation);

  const reservationStatus = useSelector((state) => state.reservation.status);
 // const reservationError = useSelector((state) => state.reservation.error);
  const variables = useSelector((state) => state.reservation.variables || []);
  const [selectedVariableNames, setSelectedVariableNames] = useState([]);
 // const userEmail = useSelector((state) => state.auth.userEmail); // Asegúrate de que 'userEmail' esté almacenado en el estado global
 const userId = useSelector((state) => state.auth.user?.id); // Asegúrate de que este es el camino correcto en Redux




  useEffect(() => {
    const fetchVariableNames = async () => {
      try {
        const response = await axios.post('http://localhost:3000/aulas/names', {
          ids: selectedVariables,
        });
        setSelectedVariableNames(response.data.names);
      } catch (error) {
        console.error('Error fetching variable names:', error);
        setSelectedVariableNames(['Unknown Variables']);
      }
    };

    if (selectedVariables.length > 0) {
      fetchVariableNames();
    }
  }, [selectedVariables]);


  useEffect(() => {
    if (variables.length === 0) {
      console.log('Variables not loaded yet.');
    }
  }, [variables])

  console.log('Datos en Redux:', {
    aulaName,
    activityName,
    selectedVariables,
    reservationDays,
    reservationHours,
    userId,
    aulaId,
  });
  

  

  const handleConfirmReservation = () => {
    if (!userId) {
      console.error('User ID is missing.');
      return; // Evitar enviar si falta el userId
    }
  
    const newReservation = {
      aulaName,
      activityName,
      selectedVariables,
      reservationDays,
      reservationHours,
      userId, // Asegúrate de tener el userId correcto aquí
      aulaId, // Asegúrate de tener el aulaId
    };
  
    console.log('Datos enviados al backend:', newReservation);
  
    dispatch(createReservation(newReservation))
      .then(() => {
        console.log('Reserva creada exitosamente');
        navigate('/Home');
      })
      .catch((error) => {
        console.error('Error al crear la reserva:', error);
      });
  };
  
  

  const handleBack = () => {
    navigate(`/Reserva3/${aulaId}`); 
  };

  return (
    <div className='container'>
      <h1>Confirm Reservation</h1>

      <div>
        <h3>Reservation Details:</h3>
        <p><strong>Classroom Name:</strong> {aulaName || 'Not Selected'}</p>
        <p><strong>Activity Name:</strong> {activityName || 'Not Provided'}</p>
        <p>
          <strong>Selected Variables:</strong>{' '}
          {selectedVariableNames.length > 0
            ? selectedVariableNames.join(', ')
            : 'None Selected'}
        </p>
        <p>
          <strong>Reservation Days:</strong>{' '}
          {reservationDays.length > 0
            ? reservationDays.join(', ')
            : 'No Days Selected'}
        </p>
        <p>
        <strong>Reservation Hours:</strong>{' '}
  {reservationHours.length > 0
    ? reservationHours.join(', ')  
    : 'No Hours Selected'}

        </p>
      </div>
    <div className='buttons'>
        <button onClick={handleBack} className="nav-btn back-btn">
          Atrás
        </button>

      <button onClick={handleConfirmReservation} className='confirm-button'>
        Confirmar Reserva
      </button>
      </div>
      {reservationStatus === 'loading' && <p>Creating reservation...</p>}
      {reservationStatus === 'succeeded' && (
        <p>Reservation created successfully!</p>
      )}
    </div>
  );
};

export default Confirmation;
 */

import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { createReservation } from '../../features/reservation/reservationSlice';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie'; // Importar js-cookie
import './confirmation.css';



const Confirmation = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { aulaId } = useParams();

  const {
    activityName,
    selectedVariables,
    reservationDays,
    reservationHours,
    aulaName,
  } = useSelector((state) => state.reservation);

  const reservationStatus = useSelector((state) => state.reservation.status);
  const [selectedVariableNames, setSelectedVariableNames] = useState([]);
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    // Obtener el userId de la cookie
    const userIdFromCookie = Cookies.get('userId');
    console.log('User ID from cookie:', userIdFromCookie); 
    if (userIdFromCookie) {
      setUserId(userIdFromCookie);
    }
  }, []);
  

  useEffect(() => {
    const fetchVariableNames = async () => {
      try {
        const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
        const response = await axios.post(`${DOMAIN_BACK}/aulas/names`, {
          ids: selectedVariables,
        });
        setSelectedVariableNames(response.data.names);
      } catch (error) {
        console.error('Error fetching variable names:', error);
        setSelectedVariableNames(['Unknown Variables']);
      }
    };

    if (selectedVariables.length > 0) {
      fetchVariableNames();
    }
  }, [selectedVariables]);


  const handleConfirmReservation = () => {
    if (!userId) {
      console.error('User ID is missing.');
      return; 
    }
  
    const newReservation = {
      aulaName,
      activityName,
      selectedVariables,
      reservationDays,
      reservationHours,
      userId,
      aulaId,
    };
  
    console.log('Datos enviados al backend:', newReservation);
  
    dispatch(createReservation(newReservation))
      .then((response) => {
        console.log('Reserva creada exitosamente', response);
        navigate('/Home');
      })
      .catch((error) => {
        console.error('Error al crear la reserva:', error);
      });
  };
  

  const handleBack = () => {
    navigate(`/Reserva3/${aulaId}`);
  };

  return (
    <div className='container'>
      <h1>Confirmar Reserva</h1>

      <div>
        <h3>Detalles de la Reserva:</h3>
        <p><strong>Nombre del Aula:</strong> {aulaName || 'No Seleccionado'}</p>
        <p><strong>Nombre de la Actividad:</strong> {activityName || 'No Proporcionado'}</p>
        <p>
          <strong>Variables Seleccionadas:</strong>{' '}
          {selectedVariableNames.length > 0
            ? selectedVariableNames.join(', ')
            : 'Ninguna Seleccionada'}
        </p>
        <p>
          <strong>Días de la Reserva:</strong>{' '}
          {reservationDays.length > 0
            ? reservationDays.join(', ')
            : 'Ningún Día Seleccionado'}
        </p>
        <p>
          <strong>Horas de la Reserva:</strong>{' '}
          {reservationHours.length > 0
            ? reservationHours.join(', ')
            : 'Ninguna Hora Seleccionada'}
        </p>
      </div>

      <div className='buttons'>
        <button onClick={handleBack} className="nav-btn back-btn">
          Atrás
        </button>

        <button 
          onClick={handleConfirmReservation} 
          className='confirm-button'
          disabled={reservationStatus === 'loading'} 
        >
          {reservationStatus === 'loading' ? 'Creando reserva...' : 'Confirmar Reserva'}
        </button>
      </div>

      {reservationStatus === 'loading' && <p>Creando reserva...</p>}
      {reservationStatus === 'succeeded' && (
        <p>¡Reserva creada exitosamente!</p>
      )}
      {reservationStatus === 'failed' && (
        <p>Error al crear la reserva. Por favor, inténtalo de nuevo.</p>
      )}
    </div>
  );
};

export default Confirmation;
