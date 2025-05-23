import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaEdit, FaTrash, FaArrowUp, FaArrowLeft } from 'react-icons/fa';

function Pedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [filtro, setFiltro] = useState('');
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

  const API_PEDIDOS = 'https://master.soporteumg.com/api.php?endpoint=pedidos';
  const API_ALMACENES = 'https://master.soporteumg.com/api.php?endpoint=almacenes';

  useEffect(() => {
    fetchPedidos();
    fetchAlmacenes();
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchPedidos = async () => {
    const res = await fetch(API_PEDIDOS);
    const data = await res.json();
    setPedidos(data);
  };

  const fetchAlmacenes = async () => {
    const res = await fetch(API_ALMACENES);
    const data = await res.json();
    setAlmacenes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${API_PEDIDOS}&id=${form.id}` : API_PEDIDOS;

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
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este pedido?')) return;
    await fetch(`${API_PEDIDOS}&id=${id}`, { method: 'DELETE' });
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

  const pedidosFiltrados = pedidos.filter((p) =>
    p.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
    p.estado.toLowerCase().includes(filtro.toLowerCase())
  );

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
      <h1 className="dashboard-title">Gestión de Pedidos 📑</h1>

      <button
        onClick={goBackToDashboard}
        className="back-button"
        style={{ alignSelf: 'flex-start', display: 'inline-block' }}
      >
        <FaArrowLeft />
      </button>

      <form onSubmit={handleSubmit} className="form">
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
          {form.id ? <><FaEdit /> Actualizar</> : <><FaCheck /> Guardar</>}
        </button>
      </form>

      <input
        type="text"
        placeholder="🔍 Buscar por cliente o estado"
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
          style={{
            width: 'max-content',
            minWidth: '100%',
            tableLayout: 'auto'
          }}
        >
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
            {pedidosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">No hay pedidos registrados.</td>
              </tr>
            ) : (
              pedidosFiltrados.map((p) => (
                <tr key={p.id}>
                  <td data-label="Cliente">{p.cliente}</td>
                  <td data-label="Estado">{p.estado}</td>
                  <td data-label="Total">{moneda}{parseFloat(p.total).toFixed(2)}</td>
                  <td data-label="Almacén">
  {almacenes.find((a) => a.id === p.almacen_id)?.nombre || '—'}
                  </td>
                  <td data-label="Acciones">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(p)}>
                        <FaEdit />
                      </button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(p.id)}>
                        <FaTrash />
                      </button>
                    </div>
                  </td>
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
      )}
    </div>
  );
}

export default Pedidos;
