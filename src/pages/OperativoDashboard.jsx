import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function OperativoDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [horaActual, setHoraActual] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setHoraActual(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="dashboard-container"
      style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        minHeight: '100vh',
        padding: '2rem',
        color: '#fff'
      }}
    >
      <div className="dashboard-header" style={{ flexWrap: 'wrap', gap: '1rem' }}>
        <h1 className="dashboard-title" style={{ flex: '1 1 100%' }}>
          Bienvenido Operativo 👷‍♂️
        </h1>

        <div style={{ color: '#fff', fontSize: '1rem', fontWeight: 'bold' }}>
          {horaActual.toLocaleDateString()} {horaActual.toLocaleTimeString()}
        </div>

        <button onClick={onLogout} className="logout-button">Cerrar sesión</button>
      </div>

      <div className="card-grid">
        {[
          { titulo: 'Productos', texto: 'Gestiona tu inventario de productos.', ruta: '/productos' },
          { titulo: 'Pedidos', texto: 'Administra órdenes de compra y venta.', ruta: '/pedidos' },
          { titulo: 'Alertas', texto: 'Revisa alertas de bajo inventario.', ruta: '/alertas' },
          { titulo: 'Entradas', texto: 'Registra productos que ingresan al almacén.', ruta: '/entradas' },
          { titulo: 'Salidas', texto: 'Registra productos que salen del almacén.', ruta: '/salidas' },
        ].map((item, index) => (
          <div className="dashboard-card" key={index}>
            <h2>{item.titulo}</h2>
            <p>{item.texto}</p>
            <button onClick={() => navigate(item.ruta)}>Ir</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default OperativoDashboard;
