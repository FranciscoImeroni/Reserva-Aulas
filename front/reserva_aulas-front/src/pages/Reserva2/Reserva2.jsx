/* const Reserva2 = () => {
  const navigate = useNavigate();
  const { aulaId } = useParams();
  const dispatch = useDispatch();

  const [reservedSlots, setReservedSlots] = useState([]);
  const [selectedSlots, setSelectedSlots] = useState([]);
  const [selectedDates, setSelectedDates] = useState([]); // Nueva variable para las fechas seleccionadas

  // Generar los horarios (8:00 a 17:30)
  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8, minute = 0;
    while (hour < 17 || (hour === 17 && minute <= 30)) {
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(formattedTime);
      minute += 30;
      if (minute === 60) { minute = 0; hour += 1; }
    }
    return slots;
  };

  const timeSlots = generateTimeSlots();

  // Fetch reservas desde el backend
  const fetchReservedSlots = async () => {
    const fecha = new Date().toISOString().split('T')[0]; // Fecha actual
    try {
      const response = await fetch(`http://localhost:3000/bookings/reservas/${aulaId}/${fecha}`);
      const data = await response.json();
      const bookedTimes = data.map(booking => booking.start.split('T')[1].slice(0, 5)); // Extraer horas
      setReservedSlots(bookedTimes);
    } catch (error) {
      console.error('Error al obtener reservas:', error);
    }
  };

  useEffect(() => {
    fetchReservedSlots();
  }, [aulaId]);

  const handleSlotClick = (slot) => {
    if (!reservedSlots.includes(slot)) {
      setSelectedSlots((prevSelected) =>
        prevSelected.includes(slot)
          ? prevSelected.filter((s) => s !== slot)
          : [...prevSelected, slot]
      );
    }
  };

  const handleContinue = async () => {
    // Verificar disponibilidad de los horarios seleccionados para todas las fechas seleccionadas
    try {
      await fetch(`http://localhost:3000/bookings/checkAvailability`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ aulaId, selectedSlots, selectedDates })
      });

      dispatch(setReservationHours(selectedSlots));
      navigate(`/Reserva3/${aulaId}`);
    } catch (error) {
      console.error('Error al verificar disponibilidad:', error);
      alert('Algunas de las horas seleccionadas ya están reservadas.');
    }
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
            key={slot}
            className={`time-slot-btn 
              ${reservedSlots.includes(slot) ? 'reserved' : ''}
              ${selectedSlots.includes(slot) ? 'selected' : ''}`}
            disabled={reservedSlots.includes(slot)} // Deshabilita el botón si está reservado
            onClick={() => handleSlotClick(slot)}
          >
            {slot}
          </button>
        ))}
      </div>
      <div className="navigation-buttons">
        <button onClick={handleBack} className="nav-btn back-btn">Atrás</button>
        <button onClick={handleContinue} className="nav-btn continue-btn">Continuar</button>
      </div>
    </div>
  );
}; */


import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Reserva2.css';
import { setReservationHours } from '../../features/reservation/reservationSlice';
import { useDispatch } from 'react-redux';


const Reserva2 = () => {
  const navigate = useNavigate();
  const { aulaId } = useParams();
  const dispatch = useDispatch();

  const generateTimeSlots = () => {
    const slots = [];
    let hour = 8;
    let minute = 0;

    while (hour < 17 || (hour === 17 && minute <= 30)) {
      const formattedTime = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      slots.push(formattedTime);

      minute += 30;
      if (minute === 60) {
        minute = 0;
        hour += 1;
      }
    }
    return slots;
  };

  const [selectedSlots, setSelectedSlots] = useState([]);
  const timeSlots = generateTimeSlots(); 


  const handleSlotClick = (slot) => {
    setSelectedSlots((prevSelected) =>
      prevSelected.includes(slot)
        ? prevSelected.filter((s) => s !== slot) 
        : [...prevSelected, slot] 
    );
  };

  const handleContinue = () => {
    console.log('Horarios seleccionados:', selectedSlots);
    dispatch(setReservationHours(selectedSlots));  // Usa dispatch aquí
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
            key={slot}
            className={`time-slot-btn ${selectedSlots.includes(slot) ? 'selected' : ''}`}
            onClick={() => handleSlotClick(slot)}
          >
            {slot}
          </button>
        ))}
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
