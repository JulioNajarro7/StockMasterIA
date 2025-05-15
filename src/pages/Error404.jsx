import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Error404() {
  const navigate = useNavigate();

  const handleBack = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
  };

  return (
    <div className="error-container">
      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '1rem' }}>
        <h1 className="error-title">404 🚫</h1>
        <p className="error-message">La página que buscas no existe.</p>
        <button onClick={handleBack} className="back-button" style={{ marginTop: '1rem' }}>
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}

export default Error404;
