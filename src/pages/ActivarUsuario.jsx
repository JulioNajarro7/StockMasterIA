import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
<<<<<<< HEAD
import fondo from '../assets/fondo1.gif';
import LogoMSX from '../assets/LogoMSX.svg';
=======
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f

function ActivarUsuario() {
  const location = useLocation();
  const navigate = useNavigate();
<<<<<<< HEAD

  // Solo email (puede venir como email o correo, pero solo usamos email)
  const email = location.state?.email || location.state?.email || '';
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
=======
  const correo = location.state?.correo || '';
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f

  const handleActivar = async (e) => {
    e.preventDefault();

<<<<<<< HEAD
    if (!email) {
=======
    if (!correo) {
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      setMensaje('❌ No se proporcionó el correo del usuario.');
      return;
    }

    if (!/^\d{6}$/.test(codigo)) {
      setMensaje('❌ El código debe tener exactamente 6 dígitos.');
      return;
    }

<<<<<<< HEAD
    setLoading(true);
    try {
      // Verificar el token (la API espera "correo" por compatibilidad)
      const resToken = await fetch(
        `https://master.soporteumg.com/api.php?endpoint=verificar_token&email=${encodeURIComponent(email)}&codigo=${codigo}`
      );
=======
    try {
      const resToken = await fetch(`https://master.soporteumg.com/api.php?endpoint=verificar_token&correo=${correo}&codigo=${codigo}`);
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      const tokenData = await resToken.json();

      if (!tokenData.success) {
        setMensaje('❌ Código incorrecto o expirado.');
<<<<<<< HEAD
        setLoading(false);
        return;
      }

      // Buscar usuario por email
      const resUsuarios = await fetch('https://master.soporteumg.com/api.php?endpoint=usuarios');
      const usuarios = await resUsuarios.json();
      // Solo usamos email
      const user = usuarios.find(u => u.email === email);

      if (!user) {
        setMensaje('❌ Usuario no encontrado.');
        setLoading(false);
        return;
      }

      // Actualizar estado a 'activo'
      const resUpdate = await fetch(
  `https://master.soporteumg.com/api.php?endpoint=usuarios&id=${user.id}`,
  {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ estado: 'activo' }) // Solo actualiza el estado
  }
);

=======
        return;
      }

      const resUsuarios = await fetch('https://master.soporteumg.com/api.php?endpoint=usuarios');
      const usuarios = await resUsuarios.json();
      const user = usuarios.find(u => u.correo === correo);

      if (!user) {
        setMensaje('❌ Usuario no encontrado.');
        return;
      }

      const actualizado = { ...user, estado: 'activo' };

      const resUpdate = await fetch(`https://master.soporteumg.com/api.php?endpoint=usuarios&id=${user.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(actualizado)
      });
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f

      const result = await resUpdate.json();
      if (result.success) {
        setMensaje('✅ Cuenta activada correctamente. Ya puedes iniciar sesión.');
<<<<<<< HEAD
        setTimeout(() => navigate('/'), 2500);
=======
        setTimeout(() => navigate('/'), 3000);
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      } else {
        setMensaje('❌ No se pudo activar la cuenta.');
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
            background: rgba(255,255,255,0.15);
            box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
            backdrop-filter: blur(8px);
            -webkit-backdrop-filter: blur(8px);
            border-radius: 18px;
            border: 1px solid rgba(255,255,255,0.25);
          }
          .form-control {
            background: rgba(255,255,255,0.65) !important;
            border-radius: 8px;
          }
          .card-title {
            font-weight: 700;
            letter-spacing: 1px;
            color: #23448c;
          }
        `}
      </style>
      <div className="login-card p-4 shadow-lg" style={{ width: 350 }}>
        <div className="text-center mb-3">
          <img src={LogoMSX} alt="Logo MasterStockX" style={{ maxWidth: 90 }} />
        </div>
        <h3 className="card-title mb-3 text-center">Activar Cuenta</h3>

        <form onSubmit={handleActivar}>
          <div className="mb-3">
            <label htmlFor="codigo" className="form-label">
              Código de activación (6 dígitos)
            </label>
            <input
              type="text"
              className="form-control"
              id="codigo"
              placeholder="Código de activación"
              value={codigo}
              onChange={(e) => setCodigo(e.target.value.replace(/\D/g, ''))}
              maxLength={6}
              required
              autoFocus
              pattern="\d{6}"
              inputMode="numeric"
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-2"
            style={{ borderRadius: 8 }}
            disabled={loading}
          >
            {loading ? "Activando..." : "Activar Cuenta"}
          </button>
        </form>

        {mensaje && (
          <div
            className="alert py-2 mt-3 text-center"
            style={{
              fontSize: 15,
              color: mensaje.includes('✅') ? '#38a169' : '#e53e3e',
              background: mensaje.includes('✅') ? "#ebfbee" : "#ffeaea",
              border: 'none'
            }}>
            {mensaje}
          </div>
=======
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Activar Cuenta</h2>

        <form onSubmit={handleActivar} className="login-form">
          <input
            type="text"
            placeholder="Código de activación (6 dígitos)"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            required
          />
          <button type="submit">Activar Cuenta</button>
        </form>

        {mensaje && (
          <p style={{ marginTop: '1.5rem', fontWeight: 'bold', color: '#333', textAlign: 'center' }}>
            {mensaje}
          </p>
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
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

<<<<<<< HEAD
export default ActivarUsuario;
=======
export default ActivarUsuario;
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
