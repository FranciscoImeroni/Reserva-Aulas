import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AulaCard from "../../components/Aula/Aula"; // Correct casing
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
        const response = await fetch(`${DOMAIN_BACK}/auth/me`, {
          credentials: 'include', // Add this to send cookies
          headers: {
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) throw new Error("Error obteniendo usuario");

        const userFromDB = await response.json();
        const storedTokenData = JSON.parse(atob(token.split(".")[1]));
        const storedRole = storedTokenData.role;

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
        setAulas(data.filter(aula => aula.visible)); // Filter visible aulas
      } catch (error) {
        console.error("Error al obtener las aulas:", error);
      }
    };

    checkUserRole().then(fetchAulas);
  }, [navigate]); // Add 'navigate' to the dependency array

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
