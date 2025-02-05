import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setActivityName, setAulaName, setSelectedVariables } from '../../features/reservation/reservationSlice';
import './Reserva3.css';

const Reserva3 = () => {
  const { aulaId } = useParams(); 
  const navigate = useNavigate(); 
  const dispatch = useDispatch();
  const activityName = useSelector((state) => state.reservation.activityName);
  const selectedVariables = useSelector((state) => state.reservation.selectedVariables); // Acceder al estado de las variables seleccionadas
  const selectedDays = useSelector((state) => state.reservation.reservationDays);
  const selectedHours = useSelector((state) => state.reservation.reservationHours);

  const [variables, setVariables] = useState([]); 
  const [selectedOptions, setSelectedOptions] = useState({}); 
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchAulaName = async () => {
      try {
        const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
        const response = await fetch(`${DOMAIN_BACK}/aulas/${aulaId}`);
        const data = await response.json();
        dispatch(setAulaName(data.name));
      } catch (error) {
        console.error('Error al obtener el nombre del aula:', error);
      }
    };
    fetchAulaName();
  }, [aulaId, dispatch]);

  useEffect(() => {
    const fetchVariables = async () => {
      try {
        const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
        const response = await fetch(`${DOMAIN_BACK}/aulas/variables`);
        const data = await response.json();
        setVariables(data);
      } catch (error) {
        console.error('Error al obtener las variables:', error);
      }
    };

    fetchVariables();
  }, [aulaId]);

  const handleChange = (e) => {
    dispatch(setActivityName(e.target.value));
  };

  const handleOptionClick = (variableId, option) => {
    setSelectedOptions((prevState) => ({
      ...prevState,
      [variableId]: option,
    }));
  };

  const handleBack = () => {
    navigate(`/Reserva2/${aulaId}`); 
  };

  const handleContinue = () => {
    const missingFields = [];

    if (!activityName.trim()) {
      missingFields.push('nombre de la actividad');
    }

    if (!selectedDays || selectedDays.length === 0) {
      missingFields.push('días');
    }

    if (!selectedHours || selectedHours.length === 0) {
      missingFields.push('horarios');
    }

    if (missingFields.length > 0) {
      setErrorMessage(`Por favor, completa los siguientes campos: ${missingFields.join(', ')}.`);
      setShowError(true);
      return;
    }

    setShowError(false);
    setErrorMessage('');
    dispatch(setActivityName(activityName));
    navigate(`/ReservaConfirmacion/${aulaId}`);
  };
  
  return (
    <div className="reserva-container">
      <div className="question-box">
        <label htmlFor="activity-name" className="question-label">
          Nombre de la actividad
        </label>
        <input
          type="text"
          id="activity-name"
          value={activityName}
          onChange={handleChange}
          placeholder="Ingresa el nombre de la actividad"
          className="input-box"
        />
      </div>

      <div className="variables-section">
        {variables.map((variable) => (
          <div key={variable.id} className="variable-question">
            <p className="variable-text">¿Necesitas {variable.name}?</p>
            <div className="variable-options">
              <button
                className={`option-btn tick ${
                  selectedOptions[variable.id] === 'tick' ? 'active' : ''
                }`}
                onClick={() => handleOptionClick(variable.id, 'tick')}
              >
                ✅
              </button>
              <button
                className={`option-btn cross ${
                  selectedOptions[variable.id] === 'cross' ? 'active' : ''
                }`}
                onClick={() => handleOptionClick(variable.id, 'cross')}
              >
                ❌
              </button>
            </div>
          </div>
        ))}
      </div>

      {showError && (
        <div className="error-message3 visible">
          {errorMessage}
        </div>
      )}

      <div className="navigation-buttons">
        <button onClick={handleBack} className="nav-btn back-btn">
          Atrás
        </button>
        <button onClick={handleContinue} className="nav-btn continue-btn">
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Reserva3;
