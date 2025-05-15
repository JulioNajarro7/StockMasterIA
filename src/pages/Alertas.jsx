import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetch('http://localhost/api.php?endpoint=productos')
      .then((res) => res.json())
      .then((data) => {
        const productosFiltrados = data
          .filter((p) => p.stock <= 10)
          .map((p) => ({
            ...p,
            tipoAlerta: p.stock <= 3 ? 'Crítico' : 'Bajo',
          }));
        setAlertas(productosFiltrados);
      })
      .catch((err) => console.error('Error al cargar alertas:', err));
  }, []);

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Alertas de Inventario 🚨</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
      </button>

      {alertas.length === 0 ? (
        <p className="empty-message">No hay alertas de inventario. Todo está bien ✅</p>
      ) : (
        <table className="table">
          <thead>
            <tr>
              <th>Producto</th>
              <th>Categoría</th>
              <th>Stock</th>
              <th>Alerta</th>
            </tr>
          </thead>
          <tbody>
            {alertas.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{prod.categoria}</td>
                <td>{prod.stock}</td>
                <td>
                  {prod.tipoAlerta === 'Crítico' ? (
                    <span style={{ color: '#e53e3e', fontWeight: 'bold' }}>🔴 Crítico</span>
                  ) : (
                    <span style={{ color: '#dd6b20', fontWeight: 'bold' }}>🟠 Bajo</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default Alertas;
