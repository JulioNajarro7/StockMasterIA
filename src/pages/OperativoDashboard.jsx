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
<<<<<<< HEAD
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
=======
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Bienvenido Operativo 👷‍♂️</h1>

        <div style={{ color: '#333', fontSize: '1rem', fontWeight: 'bold' }}>
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
          {horaActual.toLocaleDateString()} {horaActual.toLocaleTimeString()}
        </div>

        <button onClick={onLogout} className="logout-button">Cerrar sesión</button>
      </div>

      <div className="card-grid">
<<<<<<< HEAD
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
=======
        {/* Tarjetas funcionales */}
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
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
      </div>
    </div>
  );
}

export default OperativoDashboard;
