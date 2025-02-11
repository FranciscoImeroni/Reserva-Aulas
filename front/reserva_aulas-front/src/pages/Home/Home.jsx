/* import React, { useEffect, useState } from 'react';
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
 */

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AulaCard from "../../components/Aula/Aula";
import "./Home.css";

const Home = () => {
  const [aulas, setAulas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserRole = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
        // 1️⃣ Obtener el usuario desde la base de datos
        const response = await fetch(`${DOMAIN_BACK}/auth/me`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) throw new Error("Error obteniendo usuario");

        const userFromDB = await response.json();
        const storedTokenData = JSON.parse(atob(token.split(".")[1])); // Decodifica el token JWT
        const storedRole = storedTokenData.role;

        // 2️⃣ Si el rol no coincide, cerrar sesión y redirigir
        if (userFromDB.user.role !== storedRole) {
          console.log("Rol en la base de datos:", userFromDB.user.role);
          console.log("Rol en el token:", storedRole);
          console.warn("El rol ha cambiado, cerrando sesión...");
          localStorage.removeItem("token");
          navigate("/");
        }
      } catch (error) {
        console.error("Error verificando el rol del usuario", error);
        localStorage.removeItem("token");
        navigate("/");
      }
    };

    const fetchAulas = async () => {
      try {
        const DOMAIN_BACK = process.env.REACT_APP_DOMAIN_BACK;
        const response = await fetch(`${DOMAIN_BACK}/aulas`);
        const data = await response.json();
        setAulas(data);
      } catch (error) {
        console.error("Error al obtener las aulas:", error);
      }
    };

    checkUserRole().then(fetchAulas);
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
