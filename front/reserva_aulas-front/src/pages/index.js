import { useEffect, useState } from "react";
import { fetchUsers } from "../services/api";

export default function Home() {
  const [users, setUsers] = useState([]); // Estado para almacenar los usuarios
  const [loading, setLoading] = useState(true); // Estado para manejar el loading

  useEffect(() => {
    // Llamada a la API al cargar el componente
    fetchUsers()
      .then((response) => {
        setUsers(response.data); // Guardar los usuarios en el estado
        setLoading(false); // Finalizar el estado de carga
      })
      .catch((error) => {
        console.error("Error fetching users:", error);
        setLoading(false); // Finalizar el estado de carga incluso si hay error
      });
  }, []);

  if (loading) {
    return <p>Loading users...</p>;
  }

  return (
    <div>
      <h1>Users</h1>
      {users.length === 0 ? (
        <p>No users found</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user.id}>{user.name}</li> // Renderizar lista de usuarios
          ))}
        </ul>
      )}
    </div>
  );
}
