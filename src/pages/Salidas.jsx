import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import { FaArrowLeft, FaCheck, FaArrowUp } from 'react-icons/fa';
=======
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92

function Salidas() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [salida, setSalida] = useState({ producto: '', almacen: '', cantidad: '' });
  const [historial, setHistorial] = useState([]);
<<<<<<< HEAD
  const [filtro, setFiltro] = useState('');
  const [showScrollTop, setShowScrollTop] = useState(false);

  const API = 'https://master.soporteumg.com/api.php';
  const ENDPOINT_PRODUCTOS = `${API}?endpoint=productos`;
  const ENDPOINT_ALMACENES = `${API}?endpoint=almacenes`;
  const ENDPOINT_SALIDAS = `${API}?endpoint=salidas`;
  const ENDPOINT_INVENTARIO = `${API}?endpoint=inventario`;

  useEffect(() => {
    fetch(ENDPOINT_PRODUCTOS).then(res => res.json()).then(setProductos);
    fetch(ENDPOINT_ALMACENES).then(res => res.json()).then(setAlmacenes);
    fetch(ENDPOINT_SALIDAS).then(res => res.json()).then(setHistorial);

    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
=======
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    fetch('http://localhost/api.php?endpoint=productos')
      .then(res => res.json())
      .then(data => setProductos(data));

    fetch('http://localhost/api.php?endpoint=almacenes')
      .then(res => res.json())
      .then(data => setAlmacenes(data));

    fetch('http://localhost/api.php?endpoint=salidas')
      .then(res => res.json())
      .then(data => setHistorial(data));
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 200);
    };
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

<<<<<<< HEAD
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const producto = productos.find(p => p.nombre === salida.producto);
    const almacen = almacenes.find(a => a.nombre === salida.almacen);
    const cantidad = parseInt(salida.cantidad);

    if (!producto || !almacen) return alert('Producto o almacén inválido');
    if (isNaN(cantidad) || cantidad <= 0) return alert('La cantidad debe ser mayor a cero');

    const invRes = await fetch(ENDPOINT_INVENTARIO);
    const inventario = await invRes.json();
    const existente = inventario.find(i => i.producto_id === producto.id && i.almacen_id === almacen.id);

    if (!existente) return alert('No hay stock disponible para este producto en el almacén seleccionado');
    if (cantidad > existente.stock) return alert('Cantidad mayor al stock disponible');

    const nuevoStock = existente.stock - cantidad;
    await fetch(`${ENDPOINT_INVENTARIO}&id=${existente.id}`, {
=======
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productoSeleccionado = productos.find(p => p.nombre === salida.producto);
    const almacenSeleccionado = almacenes.find(a => a.nombre === salida.almacen);
    if (!productoSeleccionado || !almacenSeleccionado) return alert('Datos inválidos');

    const cantidad = parseInt(salida.cantidad);

    // Verificar si ya existe registro en inventario
    const invRes = await fetch('http://localhost/api.php?endpoint=inventario');
    const inventario = await invRes.json();
    const existente = inventario.find(i => i.producto_id === productoSeleccionado.id && i.almacen_id === almacenSeleccionado.id);

    if (!existente) {
      return alert('No hay stock disponible para este producto en el almacén seleccionado');
    }

    if (cantidad > existente.stock) {
      return alert('Cantidad mayor al stock disponible');
    }

    const nuevoStock = parseInt(existente.stock) - cantidad;
    await fetch(`http://localhost/api.php?endpoint=inventario&id=${existente.id}`, {
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: nuevoStock })
    });

<<<<<<< HEAD
    await fetch(ENDPOINT_SALIDAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ producto_id: producto.id, almacen_id: almacen.id, cantidad })
    });

    fetch(ENDPOINT_SALIDAS).then(res => res.json()).then(setHistorial);
    setSalida({ producto: '', almacen: '', cantidad: '' });
    alert('Salida registrada correctamente');
    scrollToTop();
  };

  const getNombreProducto = (id) => productos.find(p => p.id === id)?.nombre || '—';
  const getNombreAlmacen = (id) => almacenes.find(a => a.id === id)?.nombre || '—';
=======
    // Registrar salida
    await fetch('http://localhost/api.php?endpoint=salidas', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        producto_id: productoSeleccionado.id,
        almacen_id: almacenSeleccionado.id,
        cantidad: cantidad
      })
    });

    // Actualizar historial
    fetch('http://localhost/api.php?endpoint=salidas')
      .then(res => res.json())
      .then(data => setHistorial(data));

    setSalida({ producto: '', almacen: '', cantidad: '' });
    alert('Salida registrada exitosamente');
  };
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
  };

<<<<<<< HEAD
  const historialFiltrado = historial.filter((h) => {
    const nombreProd = getNombreProducto(h.producto_id).toLowerCase();
    const nombreAlm = getNombreAlmacen(h.almacen_id).toLowerCase();
    return nombreProd.includes(filtro.toLowerCase()) || nombreAlm.includes(filtro.toLowerCase());
  });

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
      <h1 className="dashboard-title">Registro de Salidas 📤</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        <FaArrowLeft />
      </button>

      <form onSubmit={handleSubmit} className="form">
=======
  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Registro de Salidas 📤</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
      </button>

      <form onSubmit={handleSubmit} className="form" style={{ flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'flex-start' }}>
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
        <select
          value={salida.producto}
          onChange={(e) => setSalida({ ...salida, producto: e.target.value })}
          required
        >
          <option value="">Selecciona un producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>

        <select
          value={salida.almacen}
          onChange={(e) => setSalida({ ...salida, almacen: e.target.value })}
          required
        >
          <option value="">Selecciona un almacén</option>
          {almacenes.map(a => (
            <option key={a.id} value={a.nombre}>{a.nombre}</option>
          ))}
        </select>

        <input
          type="number"
          value={salida.cantidad}
          onChange={(e) => setSalida({ ...salida, cantidad: e.target.value })}
          placeholder="Cantidad"
          required
        />

<<<<<<< HEAD
        <button type="submit" className="add-button">
          <FaCheck /> Registrar Salida
        </button>
      </form>

      <input
        type="text"
        placeholder="🔍 Buscar por producto o almacén"
        value={filtro}
        onChange={(e) => setFiltro(e.target.value)}
        style={{
          marginBottom: '1rem',
          padding: '0.8rem',
          borderRadius: '0.5rem',
          border: '1px solid #ccc',
          width: '100%',
          maxWidth: '400px',
          color: '#333'
        }}
      />

      <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
        <table
          className="table"
          style={{ width: 'max-content', minWidth: '100%', tableLayout: 'auto' }}
        >
          <thead>
            <tr>
              <th>Producto</th>
              <th>Almacén</th>
              <th>Cantidad</th>
              <th>Fecha</th>
            </tr>
          </thead>
          <tbody>
            {historialFiltrado.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-message">No hay registros de salida.</td>
              </tr>
            ) : (
              historialFiltrado.map((h, i) => (
                <tr key={i}>
                  <td data-label="Producto">{getNombreProducto(h.producto_id)}</td>
                  <td data-label="Almacén">{getNombreAlmacen(h.almacen_id)}</td>
                  <td data-label="Cantidad">{h.cantidad}</td>
                  <td data-label="Fecha">{new Date(h.fecha).toLocaleString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-button">
          <FaArrowUp />
        </button>
=======
        <button type="submit" className="add-button">Registrar Salida</button>
      </form>

      {historial.length > 0 && (
        <div style={{ width: '100%', maxWidth: '800px', marginTop: '2rem', textAlign: 'center' }}>
          <h2>Historial de Salidas</h2>
          <table className="table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Almacén</th>
                <th>Cantidad</th>
                <th>Fecha</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((h, index) => (
                <tr key={index}>
                  <td>{h.producto}</td>
                  <td>{h.almacen}</td>
                  <td>{h.cantidad}</td>
                  <td>{h.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-button">⬆️ Subir</button>
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
      )}
    </div>
  );
}

export default Salidas;
