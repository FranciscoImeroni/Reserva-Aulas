import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AulaCard from '../../components/Aula/Aula';
import './Home.css';



const Home = () => {
  const [aulas, setAulas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAulas = async () => {
      try {
        const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
        const response = await fetch(`${DOMAIN_BACK}/aulas`);
        const data = await response.json();
        setAulas(data);
      } catch (error) {
        console.error('Error al obtener las aulas:', error);
      }
    };

    fetchAulas();
  }, []);

  const handleCardClick = (aulaId) => {
    navigate(`/reserva/${aulaId}`);
  };

  return (
    <div>
      <h1 className="title">Lista de Aulas</h1>
      <div className="aulas-list">
        {aulas.map((aula) => (
          <AulaCard
            key={aula.id}
            id={aula.id}
            name={aula.name}
            capacity={aula.capacity}
            onClick={() => handleCardClick(aula.id)} 
          />
        ))}
      </div>
    </div>
  );
};

export default Home;
