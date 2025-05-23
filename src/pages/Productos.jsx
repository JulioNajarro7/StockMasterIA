import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheck, FaEdit, FaTrash, FaArrowUp, FaArrowLeft } from 'react-icons/fa';

function Productos() {
  const [productos, setProductos] = useState([]);
  const [filtro, setFiltro] = useState('');
  const [form, setForm] = useState({
    id: null,
    nombre: '',
    categoria: '',
    stock: '',
    precio: ''
  });
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();
  const moneda = 'Q';
  const API_URL = 'https://master.soporteumg.com/api.php?endpoint=productos';

  useEffect(() => {
    fetchProductos();
    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProductos = async () => {
    const res = await fetch(API_URL);
    const data = await res.json();
    setProductos(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id ? `${API_URL}&id=${form.id}` : API_URL;

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    fetchProductos();
    setForm({ id: null, nombre: '', categoria: '', stock: '', precio: '' });
  };

  const handleEdit = (producto) => {
    setForm({ ...producto });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm('¿Estás seguro de eliminar este producto?')) return;
    await fetch(`${API_URL}&id=${id}`, { method: 'DELETE' });
    fetchProductos();
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

  const productosFiltrados = productos.filter((prod) =>
    prod.nombre.toLowerCase().includes(filtro.toLowerCase()) ||
    prod.categoria.toLowerCase().includes(filtro.toLowerCase())
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
      <h1 className="dashboard-title">Gestión de Productos 📦</h1>

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
          placeholder="Nombre del producto"
          required
        />

        <select
          value={form.categoria}
          onChange={(e) => setForm({ ...form, categoria: e.target.value })}
          required
        >
          <option value="">Selecciona categoría</option>
          <option value="Electrónica">Electrónica</option>
          <option value="Ropa">Ropa</option>
          <option value="Alimentos">Alimentos</option>
        </select>

        <input
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
          placeholder="Stock"
          required
        />

        <input
          type="text"
          value={form.precio}
          onChange={(e) => {
            const valor = e.target.value.replace(/[^0-9.]/g, '');
            setForm({ ...form, precio: valor });
          }}
          onBlur={(e) => {
            const valor = parseFloat(e.target.value);
            if (!isNaN(valor)) {
              setForm({ ...form, precio: valor.toFixed(2) });
            }
          }}
          placeholder="Precio"
          required
        />

        <button type="submit" className="add-button">
          {form.id ? <><FaEdit /> Actualizar</> : <><FaCheck /> Guardar</>}
        </button>
      </form>

      <input
        type="text"
        placeholder="🔍 Buscar por nombre o categoría"
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
              <th>Categoría</th>
              <th>Stock</th>
              <th>Precio</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-message">No hay productos registrados.</td>
              </tr>
            ) : (
              productosFiltrados.map((prod) => (
                <tr key={prod.id}>
                  <td data-label="Nombre">{prod.nombre}</td>
                  <td data-label="Categoría">{prod.categoria}</td>
                  <td data-label="Stock">{prod.stock}</td>
                  <td data-label="Precio">{moneda}{parseFloat(prod.precio).toFixed(2)}</td>
                  <td data-label="Acciones">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button className="btn-action btn-edit" onClick={() => handleEdit(prod)}>
                        <FaEdit />
                      </button>
                      <button className="btn-action btn-delete" onClick={() => handleDelete(prod.id)}>
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

export default Productos;
