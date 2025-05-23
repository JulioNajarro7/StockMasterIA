import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [horaActual, setHoraActual] = useState(new Date());

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

    fetch('https://master.soporteumg.com/api.php?endpoint=productos')
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
          Bienvenido Administrador 🚀
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
          { titulo: 'Reportes', texto: 'Genera informes de inventario detallados.', ruta: '/reportes' },
          { titulo: 'Almacenes', texto: 'Gestiona múltiples ubicaciones de inventario.', ruta: '/almacenes' },
          { titulo: 'Usuarios', texto: 'Administra los usuarios y permisos del sistema.', ruta: '/usuarios' },
          { titulo: 'Asistente IA', texto: 'Escribe comandos y deja que la IA actúe en el sistema.', ruta: '/ai-comandos' },
          { titulo: 'Gráficas', texto: 'Visualiza tendencias de pedidos, entradas y salidas.', ruta: '/graficas' },
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

export default AdminDashboard;
