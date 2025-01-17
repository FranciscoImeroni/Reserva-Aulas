import React from 'react';
import './Aula.css';

const AulaCard = ({ name, capacity, onClick }) => {
  return (
    <div className="aula-card" onClick={onClick}>
      <h3 className="aula-name">{name}</h3>
      <p className="aula-capacity">Capacidad: {capacity}</p>
    </div>
  );
};

export default AulaCard;
