import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    fetch('http://localhost/api.php?endpoint=productos')
      .then((res) => res.json())
      .then((data) => {
        const alertas = data
          .filter((p) => p.stock <= 10)
          .map((p) => ({
            ...p,
            tipoAlerta: p.stock <= 3 ? 'Crítico' : 'Bajo',
          }));

        if (alertas.length > 0 && Notification.permission === 'granted') {
          const criticos = alertas.filter(p => p.tipoAlerta === 'Crítico');
          const bajos = alertas.filter(p => p.tipoAlerta === 'Bajo');

          const mensaje = [
            criticos.length > 0 ? `🟥 ${criticos.length} producto(s) críticos` : null,
            bajos.length > 0 ? `🟧 ${bajos.length} producto(s) bajos` : null
          ].filter(Boolean).join(', ');

          new Notification('⚠️ Alerta de Inventario', {
            body: mensaje,
            icon: '/favicon.ico'
          });
        }
      });
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Bienvenido Administrador 🚀</h1>
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
          <h2>Almacenes</h2>
          <p>Gestiona múltiples ubicaciones de inventario.</p>
          <button onClick={() => navigate('/almacenes')}>Ver almacenes</button>
        </div>

        <div className="dashboard-card">
          <h2>Usuarios</h2>
          <p>Administra los usuarios y permisos del sistema.</p>
          <button onClick={() => navigate('/usuarios')}>Ver usuarios</button>
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

export default AdminDashboard;
