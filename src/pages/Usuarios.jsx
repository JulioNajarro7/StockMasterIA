import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Usuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [form, setForm] = useState({ id: null, nombre: '', password: '', rol: '' });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchUsuarios();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchUsuarios = async () => {
    const res = await fetch('http://localhost/api.php?endpoint=usuarios');
    const data = await res.json();
    setUsuarios(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id
      ? `http://localhost/api.php?endpoint=usuarios&id=${form.id}`
      : 'http://localhost/api.php?endpoint=usuarios';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    fetchUsuarios();
    setForm({ id: null, nombre: '', password: '', rol: '' });
  };

  const handleEdit = (usuario) => {
    setForm({ id: usuario.id, nombre: usuario.nombre, password: usuario.password, rol: usuario.rol });
  };

  const handleDelete = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar este usuario?');
    if (!confirmacion) return;

    await fetch(`http://localhost/api.php?endpoint=usuarios&id=${id}`, {
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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Gestión de Usuarios 👥</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
      </button>

      <form onSubmit={handleSubmit} className="form" style={{ justifyContent: 'flex-start' }}>
        <input
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          placeholder="Nombre de usuario"
          required
        />
        <input
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Contraseña"
          type="password"
          required
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
        <button type="submit" className="add-button">
          {form.id ? 'Actualizar' : 'Agregar'} Usuario
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Rol</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {usuarios.length === 0 ? (
            <tr>
              <td colSpan="3">No hay usuarios registrados.</td>
            </tr>
          ) : (
            usuarios.map((u) => (
              <tr key={u.id}>
                <td>{u.nombre}</td>
                <td>{u.rol}</td>
                <td>
                  <button className="btn-action btn-edit" onClick={() => handleEdit(u)}>Editar</button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(u.id)}>Eliminar</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-button">
          ⬆️
        </button>
      )}
    </div>
  );
}

export default Usuarios;
