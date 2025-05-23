import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowUp, FaArrowLeft, FaEdit, FaTrash, FaCheck } from 'react-icons/fa';

function Almacenes() {
  const navigate = useNavigate();
  const [almacenes, setAlmacenes] = useState([]);
  const [form, setForm] = useState({ id: null, nombre: '', ubicacion: '', capacidad: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [filtro, setFiltro] = useState('');

  const API_ALMACENES = 'https://master.soporteumg.com/api.php?endpoint=almacenes';

  useEffect(() => {
    fetchAlmacenes();
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, []);

  const fetchAlmacenes = async () => {
    const res = await fetch(API_ALMACENES);
    const data = await res.json();
    setAlmacenes(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${API_ALMACENES}&id=${form.id}` : API_ALMACENES;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({ id: null, nombre: '', ubicacion: '', capacidad: '' });
    fetchAlmacenes();
  };

  const handleEdit = (almacen) => {
    setForm({ ...almacen });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este almacén?')) return;
    await fetch(`${API_ALMACENES}&id=${id}`, { method: 'DELETE' });
    fetchAlmacenes();
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

  const almacenesFiltrados = almacenes.filter(a =>
    a.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    a.ubicacion?.toLowerCase().includes(filtro.toLowerCase())
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
      <h1 className="dashboard-title">Gestión de Almacenes 🏢</h1>

      <button
        onClick={goBackToDashboard}
        className="back-button"
        style={{ alignSelf: 'flex-start', display: 'inline-block' }}
      >
        <FaArrowLeft />
      </button>

      <form onSubmit={handleSubmit} className="form">
        <input
          value={form.nombre}
          onChange={e => setForm({ ...form, nombre: e.target.value })}
          placeholder="Nombre del almacén"
          required
        />
        <input
          value={form.ubicacion}
          onChange={e => setForm({ ...form, ubicacion: e.target.value })}
          placeholder="Ubicación"
          required
        />
        <input
          type="number"
          value={form.capacidad}
          onChange={e => setForm({ ...form, capacidad: e.target.value })}
          placeholder="Capacidad"
          required
        />
        <button type="submit" className="add-button">
          {form.id ? (<><FaEdit /> Actualizar</>) : (<><FaCheck /> Guardar</>)}
        </button>
      </form>

      <input
        type="text"
        placeholder="🔍 Buscar almacén por nombre o ubicación"
        value={filtro}
        onChange={e => setFiltro(e.target.value)}
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
              <th>Nombre</th>
              <th>Ubicación</th>
              <th>Capacidad</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {almacenesFiltrados.length === 0 ? (
              <tr>
                <td colSpan="4" className="empty-message">No hay almacenes registrados.</td>
              </tr>
            ) : (
              almacenesFiltrados.map((a) => (
                <tr key={a.id}>
                  <td data-label="Nombre">{a.nombre}</td>
                  <td data-label="Ubicación">{a.ubicacion}</td>
                  <td data-label="Capacidad">{a.capacidad}</td>
                  <td data-label="Acciones">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(a)}>
                        <FaEdit />
                      </button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(a.id)}>
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

export default Almacenes;
