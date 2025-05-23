import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaEdit, FaTrash, FaArrowUp, FaArrowLeft } from 'react-icons/fa';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    correo: '',
    password: '',
    rol: '',
    estado: 'activo'
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  const API_USUARIOS = 'https://master.soporteumg.com/api.php?endpoint=usuarios';

  useEffect(() => {
    fetchUsuarios();

    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
    // eslint-disable-next-line
  }, []);

  const fetchUsuarios = async () => {
    const res = await fetch(API_USUARIOS);
    const data = await res.json();
    setUsuarios(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${API_USUARIOS}&id=${form.id}` : API_USUARIOS;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    fetchUsuarios();
    setForm({ id: null, nombre: '', correo: '', password: '', rol: '', estado: 'activo' });
  };

  const handleEdit = (usuario) => {
    setForm({
      id: usuario.id,
      nombre: usuario.nombre,
      correo: usuario.correo,
      password: '', // No cargues la contraseña real
      rol: usuario.rol,
      estado: usuario.estado
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este usuario?')) return;

    await fetch(`${API_USUARIOS}&id=${id}`, {
      method: 'DELETE',
    });

    fetchUsuarios();
  };

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const usuariosFiltrados = usuarios.filter(u =>
    u.nombre?.toLowerCase().includes(filtro.toLowerCase()) ||
    u.correo?.toLowerCase().includes(filtro.toLowerCase()) ||
    u.rol?.toLowerCase().includes(filtro.toLowerCase())
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
      <h1 className="dashboard-title">Gestión de Usuarios 👥</h1>

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
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder="Nombre de usuario"
          required
        />
        <input
          value={form.correo}
          onChange={(e) => setForm({ ...form, correo: e.target.value })}
          placeholder="Correo"
          type="email"
          required
        />
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Contraseña"
          type="password"
          required={!form.id}
        />
        <select
          value={form.rol}
          onChange={(e) => setForm({ ...form, rol: e.target.value })}
          required
        >
          <option value="">Selecciona rol</option>
          <option value="admin">Administrador</option>
          <option value="tecnico">Técnico</option>
          <option value="operativo">Operativo</option>
        </select>
        <select
          value={form.estado}
          onChange={(e) => setForm({ ...form, estado: e.target.value })}
          required
        >
          <option value="activo">Activo</option>
          <option value="desactivado">Desactivado</option>
        </select>
        <button type="submit" className="add-button">
          {form.id ? <><FaEdit /> Actualizar</> : <><FaCheck /> Guardar</>}
        </button>
      </form>

      <input
        type="text"
        placeholder="🔍 Buscar por nombre, correo o rol"
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
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">No hay usuarios registrados.</td>
              </tr>
            ) : (
              usuariosFiltrados.map((u) => (
                <tr key={u.id}>
                  <td data-label="Nombre">{u.nombre}</td>
                  <td data-label="Correo">{u.correo}</td>
                  <td data-label="Rol">{u.rol}</td>
                  <td data-label="Estado">{u.estado}</td>
                  <td data-label="Acciones">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(u)}>
                        <FaEdit />
                      </button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(u.id)}>
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

export default Usuarios;
