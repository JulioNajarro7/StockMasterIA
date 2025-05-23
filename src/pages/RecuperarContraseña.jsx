import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function RecuperarContraseña() {
  const [correo, setCorreo] = useState('');
  const [mensaje, setMensaje] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('Enviando correo...');

    try {
      const res = await fetch('https://master.soporteumg.com/api.php?endpoint=usuarios');
      const usuarios = await res.json();
      const usuario = usuarios.find(u => u.correo === correo);

      if (!usuario) {
        setMensaje('❌ El correo no está registrado.');
        return;
      }

      const envio = await fetch('https://master.soporteumg.com/enviar_correo.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          correo: usuario.correo,
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
      console.error(error);
      setMensaje('❌ Error en la conexión con el servidor.');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Recuperar Contraseña</h2>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={correo}
            onChange={(e) => setCorreo(e.target.value)}
            required
          />
          <button type="submit">Enviar contraseña</button>
        </form>

        <button
          type="button"
          onClick={() => navigate('/')}
          style={{
            marginTop: '1rem',
            padding: '0.8rem',
            backgroundColor: '#4caf50',
            color: 'white',
            border: 'none',
            borderRadius: '0.7rem',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease'
          }}
          onMouseOver={(e) => e.target.style.backgroundColor = '#43a047'}
          onMouseOut={(e) => e.target.style.backgroundColor = '#4caf50'}
        >
          Volver al inicio de sesión
        </button>

        {mensaje && (
          <p style={{ marginTop: '1.5rem', fontSize: '1rem', fontWeight: 'bold', color: '#333' }}>
            {mensaje}
          </p>
        )}
      </div>
    </div>
  );
}

export default RecuperarContraseña;
