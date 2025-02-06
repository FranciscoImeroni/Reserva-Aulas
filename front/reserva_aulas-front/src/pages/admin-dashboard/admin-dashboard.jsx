/* import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './admin-dashboard.css';
import { checkUserRole, api } from '../../services/api';

const AdminDashboard = () => {
  const [aulas, setAulas] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAula, setSelectedAula] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    capacity: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const verifyAdminAccess = async () => {
      const userRole = await checkUserRole();
      if (userRole !== 'Admin') {
        navigate('/home');
      }
    };
    
    verifyAdminAccess();
  }, [navigate]);

  const fetchAulas = async () => {
    try {
      const response = await api.get('/aulas');
      setAulas(response.data);
    } catch (error) {
      console.error('Error al obtener las aulas:', error);
    }
  };

  const handleDelete = async (aulaId) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta aula?')) {
      try {
        await api.delete(`/aulas/${aulaId}`);
        fetchAulas();
      } catch (error) {
        console.error('Error al eliminar el aula:', error);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const method = selectedAula ? 'put' : 'post';
      const url = selectedAula ? `/aulas/${selectedAula.id}` : '/aulas';
      
      await api[method](url, formData);
      fetchAulas();
      setShowAddModal(false);
      setShowEditModal(false);
      setFormData({ name: '', capacity: '' });
    } catch (error) {
      console.error('Error al guardar el aula:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <h1>Panel de Administración</h1>
      
      <section className="aulas-section">
        <div className="section-header">
          <h2>Gestión de Aulas</h2>
          <button onClick={() => setShowAddModal(true)} className="add-btn">
            Agregar Aula
          </button>
        </div>

        <div className="aulas-grid">
          {aulas.map((aula) => (
            <div key={aula.id} className="aula-card">
              <h3>{aula.name}</h3>
              <p>Capacidad: {aula.capacity}</p>
              <div className="card-actions">
                <button 
                  onClick={() => {
                    setSelectedAula(aula);
                    setFormData({ name: aula.name, capacity: aula.capacity });
                    setShowEditModal(true);
                  }}
                  className="edit-btn"
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleDelete(aula.id)}
                  className="delete-btn"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {(showAddModal || showEditModal) && (
        <div className="modal">
          <div className="modal-content">
            <h2>{showEditModal ? 'Editar Aula' : 'Agregar Aula'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Nombre:</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  required
                />
              </div>
              <div className="form-group">
                <label>Capacidad:</label>
                <input
                  type="number"
                  value={formData.capacity}
                  onChange={(e) => setFormData({...formData, capacity: e.target.value})}
                  required
                />
              </div>
              <div className="modal-actions">
                <button type="submit" className="save-btn">
                  {showEditModal ? 'Guardar Cambios' : 'Crear Aula'}
                </button>
                <button 
                  type="button" 
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    setFormData({ name: '', capacity: '' });
                  }}
                  className="cancel-btn"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
 */