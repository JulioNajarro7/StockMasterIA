import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function TecnicoDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [horaActual, setHoraActual] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Bienvenido Técnico 🔧</h1>

        <div style={{ color: '#333', fontSize: '1rem', fontWeight: 'bold' }}>
          {horaActual.toLocaleDateString()} {horaActual.toLocaleTimeString()}
        </div>

        <button onClick={onLogout} className="logout-button">Cerrar sesión</button>
      </div>

      <div className="card-grid">
        <div className="dashboard-card">
          <h2>Productos</h2>
          <p>Gestiona tu inventario de productos.</p>
          <button onClick={() => navigate('/productos')}>Ver productos</button>
        </div>

        <div className="dashboard-card">
          <h2>Pedidos</h2>
          <p>Administra órdenes de compra y venta.</p>
          <button onClick={() => navigate('/pedidos')}>Ver pedidos</button>
        </div>

        <div className="dashboard-card">
          <h2>Alertas</h2>
          <p>Revisa alertas de bajo inventario.</p>
          <button onClick={() => navigate('/alertas')}>Ver alertas</button>
        </div>

        <div className="dashboard-card">
          <h2>Entradas</h2>
          <p>Registra productos que ingresan al almacén.</p>
          <button onClick={() => navigate('/entradas')}>Registrar entrada</button>
        </div>

        <div className="dashboard-card">
          <h2>Salidas</h2>
          <p>Registra productos que salen del almacén.</p>
          <button onClick={() => navigate('/salidas')}>Registrar salida</button>
        </div>

        <div className="dashboard-card">
          <h2>Reportes</h2>
          <p>Genera informes de inventario detallados.</p>
          <button onClick={() => navigate('/reportes')}>Ver reportes</button>
        </div>

        <div className="dashboard-card">
          <h2>Asistente IA</h2>
          <p>Escribe comandos y deja que la IA actúe en el sistema.</p>
          <button onClick={() => navigate('/ai-comandos')}>Ir al asistente</button>
        </div>
      </div>
    </div>
  );
}

export default TecnicoDashboard;
