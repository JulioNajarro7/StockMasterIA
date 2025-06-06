import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import fondo from '../assets/fondo1.gif';
import LogoMSX from '../assets/LogoMSX.svg';

function CrearUsuario() {
  const [form, setForm] = useState({
    nombre: '',
    usuario: '',
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
=======

function CrearUsuario() {
  const [form, setForm] = useState({ nombre: '', correo: '', password: '' });
  const [mensaje, setMensaje] = useState('');
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
  const navigate = useNavigate();

  const API = 'https://master.soporteumg.com/api.php?endpoint=usuarios';

<<<<<<< HEAD
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    setLoading(true);
=======
  const generarCodigo = () => Math.floor(100000 + Math.random() * 900000).toString();

  const handleSubmit = async (e) => {
    e.preventDefault();
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f

    try {
      const check = await fetch(API);
      const usuarios = await check.json();
<<<<<<< HEAD
      const existeUsuario = usuarios.find(u => u.usuario === form.usuario);
      const existeEmail = usuarios.find(u => u.email === form.email);

      if (existeUsuario || existeEmail) {
        setMensaje('❌ El usuario o email ya están registrados.');
        setLoading(false);
        return;
      }

      const nuevoUsuario = {
        nombre: form.nombre,
        usuario: form.usuario,
        email: form.email,
        password: form.password,
        rol: 'encargado',
        estado: 'desactivado'
      };

      // Registrar usuario en BD
=======
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

>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      const res = await fetch(API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(nuevoUsuario),
      });

      if (res.ok) {
<<<<<<< HEAD
        // Enviar correo de activación
        await fetch('https://master.soporteumg.com/enviar_activacion.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: form.email,
            usuario: form.usuario,
            nombre: form.nombre
          })
        });

        navigate('/activar', { state: { email: form.email, usuario: form.usuario } });
=======
        await fetch('https://master.soporteumg.com/enviar_activacion.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ correo: form.correo, nombre: form.nombre, codigo })
        });

        navigate('/activar', { state: { correo: form.correo } });
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      } else {
        setMensaje('❌ Error al crear usuario.');
      }
    } catch (error) {
<<<<<<< HEAD
      setMensaje('❌ Error al conectar con el servidor.');
    } finally {
      setLoading(false);
=======
      console.error(error);
      setMensaje('❌ Error al conectar con el servidor.');
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
    }
  };

  return (
<<<<<<< HEAD
    <div
      className="login-bg d-flex align-items-center justify-content-center vh-100"
      style={{
        background: `url(${fondo}) center/cover no-repeat`,
        minHeight: "100vh",
      }}
    >
      <style>
        {`
          .login-card {
            background: rgba(255,255,255,0.16);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.25);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            border-radius: 15px;
            border: 1.5px solid rgba(255,255,255,0.18);
            max-width: 320px;
            width: 100%;
            padding: 1.4rem 1.1rem 1.3rem 1.1rem;
            margin: 0 7px;
          }
          .form-control {
            background: rgba(255,255,255,0.88) !important;
            border-radius: 8px;
            font-size: 1rem;
            padding: 0.6rem 0.8rem;
            margin-bottom: 0.5rem;
          }
          .card-title {
            font-weight: 700;
            letter-spacing: 1px;
            color: #23448c;
            font-size: 1.36rem;
            margin-bottom: 0.9rem;
          }
          .btn-primary {
            background: #1576fa;
            border: none;
            border-radius: 8px;
            font-size: 1rem;
            padding: 0.65rem 0;
            font-weight: 500;
          }
          .btn-primary:hover, .btn-primary:focus {
            background: #1752be;
          }
        `}
      </style>
      <div className="login-card shadow-lg">
        <div className="text-center mb-1">
          {/* Si quieres logo, descomenta abajo */}
          {/* <img src={LogoMSX} alt="Logo MasterStockX" style={{ maxWidth: 70 }} /> */}
        </div>
        <h3 className="card-title text-center">Crear nuevo usuario</h3>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="nombre" className="form-label mt-1" style={{ color: "#0996e0", fontWeight: 500 }}>
              Nombre completo
            </label>
            <input
              type="text"
              className="form-control"
              id="nombre"
              placeholder="Nombre completo"
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="usuario" className="form-label mt-1" style={{ color: "#0996e0", fontWeight: 500 }}>
              Usuario (login)
            </label>
            <input
              type="text"
              className="form-control"
              id="usuario"
              placeholder="Nombre de usuario"
              value={form.usuario}
              onChange={(e) => setForm({ ...form, usuario: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="email" className="form-label mt-1" style={{ color: "#0996e0", fontWeight: 500 }}>
              Email
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="Correo electrónico"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="form-label mt-1" style={{ color: "#0996e0", fontWeight: 500 }}>
              Contraseña
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              placeholder="Contraseña"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            disabled={loading}
          >
            {loading ? "Registrando..." : "Registrar Usuario"}
          </button>
        </form>
        {mensaje && (
          <div className="alert py-2 mt-3 text-center"
            style={{
              fontSize: 14,
              color: mensaje.includes('✅') ? '#38a169' : '#e53e3e',
              background: mensaje.includes('✅') ? "#ebfbee" : "#ffeaea",
              border: 'none'
            }}>
            {mensaje}
          </div>
        )}
        <p style={{ marginTop: '1.2rem', textAlign: 'center', fontSize: '0.9rem' }}>
=======
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
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
          <a href="/" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
            Volver al inicio de sesión
          </a>
        </p>
      </div>
    </div>
  );
}

export default CrearUsuario;
