import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaCheck, FaArrowUp } from 'react-icons/fa';

function Entradas() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [entrada, setEntrada] = useState({ producto: '', almacen: '', cantidad: '' });
  const [historial, setHistorial] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);

  const API = 'https://master.soporteumg.com/api.php';
  const ENDPOINT_PRODUCTOS = `${API}?endpoint=productos`;
  const ENDPOINT_ALMACENES = `${API}?endpoint=almacenes`;
  const ENDPOINT_ENTRADAS = `${API}?endpoint=entradas`;
  const ENDPOINT_INVENTARIO = `${API}?endpoint=inventario`;

  useEffect(() => {
    fetch(ENDPOINT_PRODUCTOS).then(res => res.json()).then(setProductos);
    fetch(ENDPOINT_ALMACENES).then(res => res.json()).then(setAlmacenes);
    fetch(ENDPOINT_ENTRADAS).then(res => res.json()).then(setHistorial);

    const handleScroll = () => setShowScrollTop(window.scrollY > 200);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const producto = productos.find(p => p.nombre === entrada.producto);
    const almacen = almacenes.find(a => a.nombre === entrada.almacen);
    const cantidad = parseInt(entrada.cantidad);

    if (!producto || !almacen) return alert('Producto o almacén inválido');
    if (isNaN(cantidad) || cantidad <= 0) return alert('La cantidad debe ser mayor a cero');

    const invRes = await fetch(ENDPOINT_INVENTARIO);
    const inventario = await invRes.json();
    const existente = inventario.find(i =>
      i.producto_id === producto.id && i.almacen_id === almacen.id
    );

    if (existente) {
      const nuevoStock = parseInt(existente.stock) + cantidad;
      await fetch(`${ENDPOINT_INVENTARIO}&id=${existente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stock: nuevoStock })
      });
    } else {
      await fetch(ENDPOINT_INVENTARIO, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          producto_id: producto.id,
          almacen_id: almacen.id,
          stock: cantidad
        })
      });
    }

    await fetch(ENDPOINT_ENTRADAS, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        producto_id: producto.id,
        almacen_id: almacen.id,
        cantidad
      })
    });

    fetch(ENDPOINT_ENTRADAS).then(res => res.json()).then(setHistorial);
    setEntrada({ producto: '', almacen: '', cantidad: '' });
    alert('Entrada registrada correctamente');
    scrollToTop();
  };

  const getNombreProducto = (id) => productos.find(p => p.id === id)?.nombre || '—';
  const getNombreAlmacen = (id) => almacenes.find(a => a.id === id)?.nombre || '—';

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
      <h1 className="dashboard-title">Registro de Entradas 📥</h1>

      <button
        onClick={goBackToDashboard}
        className="back-button"
        style={{ alignSelf: 'flex-start', display: 'inline-block' }}
      >
        <FaArrowLeft />
      </button>

      <form onSubmit={handleSubmit} className="form">
        <select
          value={entrada.producto}
          onChange={(e) => setEntrada({ ...entrada, producto: e.target.value })}
          required
        >
          <option value="">Selecciona un producto</option>
          {productos.map(p => (
            <option key={p.id} value={p.nombre}>{p.nombre}</option>
          ))}
        </select>

        <select
          value={entrada.almacen}
          onChange={(e) => setEntrada({ ...entrada, almacen: e.target.value })}
          required
        >
          <option value="">Selecciona un almacén</option>
          {almacenes.map(a => (
            <option key={a.id} value={a.nombre}>{a.nombre}</option>
          ))}
        </select>

        <input
          type="number"
          value={entrada.cantidad}
          onChange={(e) => setEntrada({ ...entrada, cantidad: e.target.value })}
          placeholder="Cantidad"
          required
        />

        <button type="submit" className="add-button">
          <FaCheck /> Registrar Entrada
        </button>
      </form>

      {historial.length > 0 && (
        <div style={{ overflowX: 'auto', maxWidth: '100%' }}>
          <h2 style={{ textAlign: 'center', color: '#fff', margin: '1rem 0' }}>
            Historial de Entradas
          </h2>
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
              {historial.map((h, i) => (
                <tr key={i}>
                  <td data-label="Producto">{getNombreProducto(h.producto_id)}</td>
                  <td data-label="Almacén">{getNombreAlmacen(h.almacen_id)}</td>
                  <td data-label="Cantidad">{h.cantidad}</td>
                  <td data-label="Fecha">{new Date(h.fecha).toLocaleString()}</td>
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

export default Entradas;
