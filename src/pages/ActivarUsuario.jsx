import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

function ActivarUsuario() {
  const location = useLocation();
  const navigate = useNavigate();
  const correo = location.state?.correo || '';
  const [codigo, setCodigo] = useState('');
  const [mensaje, setMensaje] = useState('');

  const handleActivar = async (e) => {
    e.preventDefault();

    if (!correo) {
      setMensaje('❌ No se proporcionó el correo del usuario.');
      return;
    }

    if (!/^\d{6}$/.test(codigo)) {
      setMensaje('❌ El código debe tener exactamente 6 dígitos.');
      return;
    }

    try {
      const resToken = await fetch(`https://master.soporteumg.com/api.php?endpoint=verificar_token&correo=${correo}&codigo=${codigo}`);
      const tokenData = await resToken.json();

      if (!tokenData.success) {
        setMensaje('❌ Código incorrecto o expirado.');
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

      const result = await resUpdate.json();
      if (result.success) {
        setMensaje('✅ Cuenta activada correctamente. Ya puedes iniciar sesión.');
        setTimeout(() => navigate('/'), 3000);
      } else {
        setMensaje('❌ No se pudo activar la cuenta.');
      }
    } catch (error) {
      console.error(error);
      setMensaje('❌ Error al conectar con el servidor.');
    }
  };

  return (
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

export default ActivarUsuario;