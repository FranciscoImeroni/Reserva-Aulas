import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { setReservationDays, setAulaName } from '../../features/reservation/reservationSlice';
import './Reserva1.css';

const Reserva1 = () => {
  const { aulaId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const aulaName = useSelector((state) => state.reservation.aulaName);

  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth()); 
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());

  const [selectedDays, setSelectedDays] = useState([]);

  const generateDays = (month, year) => {
    const daysInMonth = new Date(year, month + 1, 0).getDate(); 
    return Array.from({ length: daysInMonth }, (_, i) => i + 1);
  };

  const days = generateDays(currentMonth, currentYear);

  const handleDayClick = (day) => {
    const dayIdentifier = `${day}/${currentMonth + 1}/${currentYear}`; 
    setSelectedDays((prev) =>
      prev.includes(dayIdentifier)
        ? prev.filter((d) => d !== dayIdentifier)
        : [...prev, dayIdentifier]
    );
  };

  const handleNextMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 11 ? 0 : prevMonth + 1));
    if (currentMonth === 11) setCurrentYear((prevYear) => prevYear + 1);
  };

  const handlePrevMonth = () => {
    setCurrentMonth((prevMonth) => (prevMonth === 0 ? 11 : prevMonth - 1));
    if (currentMonth === 0) setCurrentYear((prevYear) => prevYear - 1);
  };

  const handleContinue = () => {
    dispatch(setReservationDays(selectedDays));
    navigate(`/Reserva2/${aulaId}`);
  };

  useEffect(() => {
    dispatch(setAulaName(aulaName)); //////////////
  }, [dispatch, aulaName]);

  return (
    <div className="reserva2-container">
      <h2>Selecciona el/los día(s) de la reserva</h2>
      
      <div className="month-controls">
        <button onClick={handlePrevMonth} className='month-btn'>&lt; Mes Anterior</button>
        <span>
          {new Date(currentYear, currentMonth).toLocaleString('es-ES', {
            month: 'long',
            year: 'numeric',
          })}
        </span>
        <button onClick={handleNextMonth} className='month-btn'>Mes Siguiente &gt;</button>
      </div>

      <div className="calendar">
        {days.map((day) => {
          const dayIdentifier = `${day}/${currentMonth + 1}/${currentYear}`;
          return (
            <div
              key={dayIdentifier}
              className={`day ${selectedDays.includes(dayIdentifier) ? 'selected' : ''}`}
              onClick={() => handleDayClick(day)}
            >
              {day}
            </div>
          );
        })}
      </div>

      <div className="navigation-buttons">
      <button onClick={() => navigate(`/Home`)} className="nav-btn back-btn">
          Atrás
        </button>
        <button onClick={handleContinue} className="nav-btn continue-btn">
          Continuar
        </button>
      </div>
    </div>
  );
};

export default Reserva1;
