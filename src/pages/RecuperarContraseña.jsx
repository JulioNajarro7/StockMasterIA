import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fondo from '../assets/fondo.gif'; // asegúrate que la ruta es correcta
import LogoMSX from '../assets/LogoMSX.svg';

function RecuperarContraseña() {
  const [email, setEmail] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMensaje('Enviando correo...');

    try {
      const res = await fetch('https://master.soporteumg.com/api.php?endpoint=usuarios');
      const usuarios = await res.json();
      // Ahora el campo es email
      const usuario = usuarios.find(u => u.email === email);

      if (!usuario) {
        setMensaje('❌ El correo no está registrado.');
        setLoading(false);
        return;
      }

      const envio = await fetch('https://master.soporteumg.com/enviar_correo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: usuario.email,       // Cambiado a "email"
          usuario: usuario.usuario,   // Nuevo campo "usuario"
          nombre: usuario.nombre,
          password: usuario.password
        })
      });

      const result = await envio.json();
      if (result.success) {
        setMensaje('✅ Correo enviado con tu contraseña.');
      } else {
        setMensaje('❌ No se pudo enviar el correo.');
      }
    } catch (error) {
      setMensaje('❌ Error en la conexión con el servidor.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex align-items-center justify-content-center vh-100"
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
        <h3 className="card-title mb-3 text-center">Recuperar Contraseña</h3>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Correo electrónico
            </label>
            <input
              type="email"
              className="form-control"
              id="email"
              placeholder="tucorreo@ejemplo.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary w-100 mt-1"
            style={{ borderRadius: 8 }}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar contraseña"}
          </button>
        </form>
        <button
          type="button"
          className="btn btn-success w-100 mt-3"
          style={{ borderRadius: 8 }}
          onClick={() => navigate('/')}
          disabled={loading}
        >
          Volver al inicio de sesión
        </button>
        {mensaje && (
          <div
            className="alert mt-3"
            style={{
              fontSize: '1rem',
              fontWeight: 'bold',
              color: mensaje.startsWith('✅') ? 'green' : '#c1121f',
              background: mensaje.startsWith('✅') ? '#e9fbe8' : '#ffe8e6',
              border: 'none'
            }}
          >
            {mensaje}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecuperarContraseña;
