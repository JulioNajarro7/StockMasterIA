import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Almacenes() {
  const navigate = useNavigate();
  const [almacenes, setAlmacenes] = useState([]);
  const [form, setForm] = useState({ nombre: '', ubicacion: '', capacidad: '' });

  useEffect(() => {
    fetch('http://localhost/api.php?endpoint=almacenes')
      .then(res => res.json())
      .then(data => setAlmacenes(data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await fetch('http://localhost/api.php?endpoint=almacenes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form)
    });
    setForm({ nombre: '', ubicacion: '', capacidad: '' });
    fetch('http://localhost/api.php?endpoint=almacenes')
      .then(res => res.json())
      .then(data => setAlmacenes(data));
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
      <h1 className="dashboard-title">Gestión de Almacenes 🏢</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>←</button>

      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Nombre del almacén"
          value={form.nombre}
          onChange={(e) => setForm({ ...form, nombre: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Ubicación"
          value={form.ubicacion}
          onChange={(e) => setForm({ ...form, ubicacion: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Capacidad"
          value={form.capacidad}
          onChange={(e) => setForm({ ...form, capacidad: e.target.value })}
          required
        />
        <button type="submit" className="add-button">Agregar Almacén</button>
      </form>

      <ul className="list">
        {almacenes.map((a) => (
          <li key={a.id}>
            <strong>{a.nombre}</strong> - {a.ubicacion} (Capacidad: {a.capacidad})
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Almacenes;
