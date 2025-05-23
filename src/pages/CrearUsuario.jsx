import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function CrearUsuario() {
  const [form, setForm] = useState({ nombre: '', correo: '', password: '' });
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const API = 'https://master.soporteumg.com/api.php?endpoint=usuarios';

  const generarCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const check = await fetch(API);
      const usuarios = await check.json();
      const existeNombre = usuarios.find(u => u.nombre === form.nombre);
      const existeCorreo = usuarios.find(u => u.correo === form.correo);

      if (existeNombre || existeCorreo) {
        setMensaje('❌ El nombre o correo ya están registrados.');
        return;
      }

      const codigo = generarCodigo();

      const nuevoUsuario = {
        ...form,
        rol: 'operativo',
        estado: 'desactivado',
        codigo_activacion: codigo
      };

      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario),
      });

      if (res.ok) {
        await fetch('https://master.soporteumg.com/enviar_activacion.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: form.correo, nombre: form.nombre, codigo })
        });

        navigate('/activar', { state: { correo: form.correo } });
      } else {
        setMensaje('❌ Error al crear usuario.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al conectar con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Crear nuevo usuario</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Nombre de usuario"
            value={form.nombre}
            onChange={(e) => setForm({ ...form, nombre: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={form.correo}
            onChange={(e) => setForm({ ...form, correo: e.target.value })}
            required
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
          <button type="submit">Registrar Usuario</button>
        </form>

        {mensaje && (
          <p style={{
            marginTop: '1.5rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: mensaje.includes('✅') ? '#38a169' : '#e53e3e'
          }}>
            {mensaje}
          </p>
        )}

        <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem' }}>
          <a href="/" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
            Volver al inicio de sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default CrearUsuario;
