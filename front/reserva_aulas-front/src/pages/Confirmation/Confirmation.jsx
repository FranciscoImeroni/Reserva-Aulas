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
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

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
  const [successMessage, setSuccessMessage] = useState(null);

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
    // Validar todos los campos requeridos
    const missingFields = [];

    if (!activityName?.trim()) {
      missingFields.push('nombre de la actividad');
    }
    if (!reservationDays?.length) {
      missingFields.push('días');
    }
    if (!reservationHours?.length) {
      missingFields.push('horarios');
    }
    if (!aulaName) {
      missingFields.push('aula');
    }

    if (missingFields.length > 0) {
      setErrorMessage(`No se puede crear la reserva. Faltan campos obligatorios: ${missingFields.join(', ')}.`);
      setShowError(true);
      return;
    }

    // Si todo está validado, proceder con la reserva
    setShowError(false);
    const formattedDays = reservationDays.map(date => {
      try {
        const [day, month, year] = date.split('/');
        const formattedDate = new Date(`${year}-${month}-${day}`);
        return formattedDate.toISOString().split('T')[0];
      } catch (error) {
        console.error('Invalid date format:', date);
        return null;
      }
    }).filter(date => date !== null);

    const newReservation = {
      aulaName,
      activityName,
      selectedVariables,
      reservationDays: formattedDays,
      reservationHours,
      userId,
      aulaId,
    };

    dispatch(createReservation(newReservation))
      .unwrap()
      .then((response) => {
        setSuccessMessage('¡Reserva creada exitosamente!');
        setTimeout(() => {
          navigate('/Home');
        }, 5000);
      })
      .catch((error) => {
        console.error('Error al crear la reserva:', error);
        const errorMsg = error.message || 'Error al crear la reserva. Por favor, inténtalo de nuevo.';
        setErrorMessage(errorMsg);
        setShowError(true);
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

      {showError && (
        <div className="error-message visible">
          {errorMessage}
        </div>
      )}

      {successMessage && (
        <div className="success-message">
          {successMessage}
        </div>
      )}

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
    </div>
  );
};

export default Confirmation;
