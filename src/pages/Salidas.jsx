import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Salidas() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [salida, setSalida] = useState({ producto: '', almacen: '', cantidad: '' });
  const [historial, setHistorial] = useState([]);
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
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ stock: nuevoStock })
    });

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

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Registro de Salidas 📤</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
      </button>

      <form onSubmit={handleSubmit} className="form" style={{ flexWrap: 'nowrap', alignItems: 'center', justifyContent: 'flex-start' }}>
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
      )}
    </div>
  );
}

export default Salidas;
