import { useNavigate } from 'react-router-dom';
import { useEffect, useState, useRef } from 'react';
import html2pdf from 'html2pdf.js';

function Reportes() {
  const navigate = useNavigate();
  const [productos, setProductos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [pedidos, setPedidos] = useState([]);
  const [reporte, setReporte] = useState('inventario');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const reporteRef = useRef();

  useEffect(() => {
    if (reporte === 'inventario' || reporte === 'bajoStock') {
      fetch('http://localhost/api.php?endpoint=productos')
        .then(res => res.json())
        .then(data => setProductos(data));
    } else if (reporte === 'entradas') {
      fetch('http://localhost/api.php?endpoint=entradas')
        .then(res => res.json())
        .then(data => setEntradas(data));
    } else if (reporte === 'salidas') {
      fetch('http://localhost/api.php?endpoint=salidas')
        .then(res => res.json())
        .then(data => setSalidas(data));
    } else if (reporte === 'pedidos') {
      fetch('http://localhost/api.php?endpoint=pedidos')
        .then(res => res.json())
        .then(data => setPedidos(data));
    }
  }, [reporte]);

  const generarPDF = () => {
    const opt = {
      margin: 0.5,
      filename: `reporte-${reporte}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(reporteRef.current).save();
  };

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
  };

  const filtrarPorFecha = (data) => {
    if (!fechaInicio || !fechaFin) return data;
    const start = new Date(fechaInicio);
    const end = new Date(fechaFin);
    return data.filter((item) => {
      const fecha = new Date(item.fecha);
      return fecha >= start && fecha <= end;
    });
  };

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Reportes 📊</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>←</button>

      <div style={{ marginBottom: '1rem' }}>
        <label><strong>Tipo de reporte: </strong></label>
        <select value={reporte} onChange={(e) => setReporte(e.target.value)} style={{ padding: '0.5rem', marginLeft: '0.5rem' }}>
          <option value="inventario">Inventario general</option>
          <option value="entradas">Entradas por fecha</option>
          <option value="salidas">Salidas por fecha</option>
          <option value="pedidos">Pedidos por estado</option>
          <option value="bajoStock">Productos con bajo stock</option>
        </select>
      </div>

      {(reporte === 'entradas' || reporte === 'salidas') && (
        <div style={{ marginBottom: '1rem' }}>
          <label>Desde: </label>
          <input type="date" value={fechaInicio} onChange={(e) => setFechaInicio(e.target.value)} style={{ marginRight: '1rem' }} />
          <label>Hasta: </label>
          <input type="date" value={fechaFin} onChange={(e) => setFechaFin(e.target.value)} />
        </div>
      )}

      <div ref={reporteRef} style={{ width: '100%', maxWidth: '1000px', marginTop: '1rem' }}>
        {reporte === 'inventario' && (
          <table className="table">
            <thead>
              <tr><th>Producto</th><th>Categoría</th><th>Stock</th><th>Precio</th></tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td><td>{p.categoria}</td><td>{p.stock}</td><td>Q{parseFloat(p.precio).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reporte === 'bajoStock' && (
          <table className="table">
            <thead><tr><th>Producto</th><th>Categoría</th><th>Stock</th></tr></thead>
            <tbody>
              {productos.filter(p => p.stock <= 10).map(p => (
                <tr key={p.id}>
                  <td>{p.nombre}</td><td>{p.categoria}</td><td>{p.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reporte === 'entradas' && (
          <table className="table">
            <thead><tr><th>ID Producto</th><th>Cantidad</th><th>Almacén</th><th>Fecha</th></tr></thead>
            <tbody>
              {filtrarPorFecha(entradas).map((e, i) => (
                <tr key={i}>
                  <td>{e.producto_id}</td><td>{e.cantidad}</td><td>{e.almacen_id}</td><td>{e.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reporte === 'salidas' && (
          <table className="table">
            <thead><tr><th>ID Producto</th><th>Cantidad</th><th>Almacén</th><th>Fecha</th></tr></thead>
            <tbody>
              {filtrarPorFecha(salidas).map((s, i) => (
                <tr key={i}>
                  <td>{s.producto_id}</td><td>{s.cantidad}</td><td>{s.almacen_id}</td><td>{s.fecha}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {reporte === 'pedidos' && (
          <table className="table">
            <thead><tr><th>Cliente</th><th>Estado</th><th>Total</th><th>Almacén</th></tr></thead>
            <tbody>
              {pedidos.map((p, i) => (
                <tr key={i}>
                  <td>{p.cliente}</td><td>{p.estado}</td><td>Q{parseFloat(p.total).toFixed(2)}</td><td>{p.almacen_id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <button className="add-button" onClick={generarPDF} style={{ marginTop: '1rem' }}>
        Generar Reporte PDF
      </button>
    </div>
  );
}

export default Reportes;
