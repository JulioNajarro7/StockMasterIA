import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Productos() {
  const [productos, setProductos] = useState([]);
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

  useEffect(() => {
    fetchProductos();

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const fetchProductos = async () => {
    const res = await fetch('http://localhost/api.php?endpoint=productos');
    const data = await res.json();
    setProductos(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = form.id ? 'PUT' : 'POST';
    const url = form.id
      ? `http://localhost/api.php?endpoint=productos&id=${form.id}`
      : 'http://localhost/api.php?endpoint=productos';

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
  };

  const handleDelete = async (id) => {
    const confirmacion = window.confirm('¿Estás seguro de eliminar este producto?');
    if (!confirmacion) return;

    await fetch(`http://localhost/api.php?endpoint=productos&id=${id}`, {
      method: 'DELETE',
    });

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

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">Gestión de Productos 📦</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
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
          {form.id ? 'Actualizar' : 'Agregar'} Producto
        </button>
      </form>

      <table className="table">
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
          {productos.length === 0 ? (
            <tr>
              <td colSpan="5">No hay productos registrados.</td>
            </tr>
          ) : (
            productos.map((prod) => (
              <tr key={prod.id}>
                <td>{prod.nombre}</td>
                <td>{prod.categoria}</td>
                <td>{prod.stock}</td>
                <td>{moneda}{parseFloat(prod.precio).toFixed(2)}</td>
                <td>
                  <button className="btn-action btn-edit" onClick={() => handleEdit(prod)}>Editar</button>
                  <button className="btn-action btn-delete" onClick={() => handleDelete(prod.id)}>Eliminar</button>
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

export default Productos;
