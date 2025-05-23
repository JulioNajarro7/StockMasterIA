import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaArrowUp } from 'react-icons/fa';

function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const API_PRODUCTOS = 'https://master.soporteumg.com/api.php?endpoint=productos';

  useEffect(() => {
    fetch(API_PRODUCTOS)
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

    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
  };

  return (
    <div
      className="dashboard-container"
      style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        minHeight: '100vh',
        padding: '2rem 1rem',
        color: '#fff',
        margin: '0 auto',
      }}
    >
      <h1 className="dashboard-title">Alertas de Inventario 🚨</h1>

      <button
        onClick={goBackToDashboard}
        className="back-button"
        style={{ alignSelf: 'flex-start', display: 'inline-block' }}
      >
        <FaArrowLeft />
      </button>

      {alertas.length === 0 ? (
        <p className="empty-message">No hay alertas de inventario. Todo está bien ✅</p>
      ) : (
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <table
            className="table"
            style={{
              width: 'max-content',
              minWidth: '100%',
              tableLayout: 'auto'
            }}
          >
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
                  <td data-label="Producto">{prod.nombre}</td>
                  <td data-label="Categoría">{prod.categoria}</td>
                  <td data-label="Stock">{prod.stock}</td>
                  <td data-label="Alerta">
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
        </div>
      )}

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-button">
          <FaArrowUp />
        </button>
      )}
    </div>
  );
}

export default Alertas;
