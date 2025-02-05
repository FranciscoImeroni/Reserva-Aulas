import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Reserva2.css';
import { setReservationHours } from '../../features/reservation/reservationSlice';
import { useDispatch, useSelector } from 'react-redux';

const Reserva2 = () => {
  const navigate = useNavigate();
  const { aulaId } = useParams();
  const dispatch = useDispatch();
  const selectedDays = useSelector((state) => state.reservation.reservationDays);
  const [reservedSlots, setReservedSlots] = useState([]);
  const [showError, setShowError] = useState(false);

  useEffect(() => {
    const fetchReservedSlots = async () => {
      try {
        const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
        const [day, month, year] = selectedDays[0].split('/');
        const formattedDate = `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
        const response = await fetch(`${DOMAIN_BACK}/bookings/reservas/${aulaId}?fecha=${encodeURIComponent(formattedDate)}`);
        const data = await response.json();
        setReservedSlots(data.reservedSlots || []);
      } catch (error) {
        console.error('Error fetching reserved slots:', error);
        setReservedSlots([]);
      }
    };

    if (selectedDays.length > 0) {
      fetchReservedSlots();
    }
  }, [aulaId, selectedDays]);

  const generateTimeSlots = (reservedSlots) => {
    const slots = [];
    let hour = 8;
    let minute = 0;

    while (hour < 17 || (hour === 17 && minute <= 30)) {
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push({
        time: formattedTime,
        reserved: reservedSlots.includes(formattedTime),
      });

      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }
    }
    return slots;
  };

  const [selectedSlots, setSelectedSlots] = useState([]);
  const timeSlots = generateTimeSlots(reservedSlots);

  const handleSlotClick = (slot) => {
    if (slot.reserved) return;
    setSelectedSlots((prevSelected) =>
      prevSelected.includes(slot.time)
        ? prevSelected.filter((s) => s !== slot.time) 
        : [...prevSelected, slot.time]
    );
  };

  const handleContinue = () => {
    if (selectedSlots.length === 0) {
      setShowError(true);
      return;
    }
    setShowError(false);
    console.log('Horarios seleccionados:', selectedSlots);
    dispatch(setReservationHours(selectedSlots));
    navigate(`/Reserva3/${aulaId}`);
  };

  const handleBack = () => {
    navigate(`/Reserva/${aulaId}`);
  };

  return (
    <div className="reserva-container">
      <h2 className="title">Selecciona los horarios que quieres reservar</h2>
      <div className="time-slots-container">
        {timeSlots.map((slot) => (
          <button
            key={slot.time}
            className={`time-slot-btn ${slot.reserved ? 'disabled' : ''} ${selectedSlots.includes(slot.time) ? 'selected' : ''}`}
            onClick={() => handleSlotClick(slot)}
            disabled={slot.reserved}
          >
            {slot.time}
          </button>
        ))}
      </div>
      <div className={`error-message2 ${showError ? 'visible' : ''}`}>
        Por favor, selecciona al menos un horario para continuar.
      </div>
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

export default Reserva2;
