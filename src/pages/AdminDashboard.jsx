<<<<<<< HEAD
import { useEffect, useState } from 'react';
=======
import { useEffect } from 'react';
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
import { useNavigate } from 'react-router-dom';

function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
<<<<<<< HEAD
  const [horaActual, setHoraActual] = useState(new Date());
=======
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92

  useEffect(() => {
    if (Notification.permission !== 'granted') {
      Notification.requestPermission();
    }

<<<<<<< HEAD
    fetch('https://master.soporteumg.com/api.php?endpoint=productos')
=======
    fetch('http://localhost/api.php?endpoint=productos')
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
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
<<<<<<< HEAD

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

=======
  }, []);

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Bienvenido Administrador 🚀</h1>
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
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
=======
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
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
      </div>
    </div>
  );
}

export default AdminDashboard;
