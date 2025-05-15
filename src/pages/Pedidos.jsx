import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [form, setForm] = useState({
    id: null,
    cliente: '',
    estado: '',
    total: '',
    almacen_id: ''
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const moneda = 'Q';

  useEffect(() => {
    fetchPedidos();
    fetchAlmacenes();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPedidos = async () => {
    const res = await fetch('http://localhost/api.php?endpoint=pedidos');
    const data = await res.json();
    setPedidos(data);
  };

  const fetchAlmacenes = async () => {
    const res = await fetch('http://localhost/api.php?endpoint=almacenes');
    const data = await res.json();
    setAlmacenes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id
      ? `http://localhost/api.php?endpoint=pedidos&id=${form.id}`
      : 'http://localhost/api.php?endpoint=pedidos';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    fetchPedidos();
    setForm({ id: null, cliente: '', estado: '', total: '', almacen_id: '' });
  };

  const handleEdit = (pedido) => {
    setForm({
      id: pedido.id,
      cliente: pedido.cliente,
      estado: pedido.estado,
      total: pedido.total,
      almacen_id: pedido.almacen_id
    });
  };

  const handleDelete = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar este pedido?');
    if (!confirmacion) return;

    await fetch(`http://localhost/api.php?endpoint=pedidos&id=${id}`, {
      method: 'DELETE',
    });

    fetchPedidos();
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      <h1 className="dashboard-title">Gestión de Pedidos 📑</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
      </button>

      <form onSubmit={handleSubmit} className="form" style={{ justifyContent: 'flex-start' }}>
        <input
          value={form.cliente}
          onChange={(e) => setForm({ ...form, cliente: e.target.value })}
          placeholder="Cliente"
          required
        />

        <select
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
          required
        >
          <option value="">Selecciona estado</option>
          <option value="Pendiente">Pendiente</option>
          <option value="En proceso">En proceso</option>
          <option value="Enviado">Enviado</option>
          <option value="Cancelado">Cancelado</option>
        </select>

        <input
          type="text"
          value={form.total}
          onChange={(e) => {
            const valor = e.target.value.replace(/[^0-9.]/g, '');
            setForm({ ...form, total: valor });
          }}
          onBlur={(e) => {
            const valor = parseFloat(e.target.value);
            if (!isNaN(valor)) {
              setForm({ ...form, total: valor.toFixed(2) });
            }
          }}
          placeholder="Total"
          required
        />

        <select
          value={form.almacen_id}
          onChange={(e) => setForm({ ...form, almacen_id: e.target.value })}
          required
        >
          <option value="">Selecciona almacén</option>
          {almacenes.map((a) => (
            <option key={a.id} value={a.id}>{a.nombre}</option>
          ))}
        </select>

        <button type="submit" className="add-button">
          {form.id ? 'Actualizar' : 'Agregar'} Pedido
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Cliente</th>
            <th>Estado</th>
            <th>Total</th>
            <th>Almacén</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {pedidos.length === 0 ? (
            <tr>
              <td colSpan="5">No hay pedidos registrados.</td>
            </tr>
          ) : (
            pedidos.map((p) => (
              <tr key={p.id}>
                <td>{p.cliente}</td>
                <td>{p.estado}</td>
                <td>{moneda}{parseFloat(p.total).toFixed(2)}</td>
                <td>{p.almacen_nombre || '—'}</td>
                <td>
                  <button className="btn-action btn-edit" onClick={() => handleEdit(p)}>Editar</button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(p.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-button">
          ⬆️ Subir
        </button>
      )}
    </div>
  );
}

export default Pedidos;
