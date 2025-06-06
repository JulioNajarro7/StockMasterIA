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
<<<<<<< HEAD
=======
<<<<<<< HEAD
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
    <div className="error-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div style={{ backgroundColor: 'rgba(255,255,255,0.95)', padding: '3rem', borderRadius: '1rem', textAlign: 'center', boxShadow: '0 0 15px rgba(0,0,0,0.1)' }}>
        <h1 className="error-title" style={{ fontSize: '5rem', marginBottom: '1rem', color: '#e53e3e' }}>404 🚫</h1>
        <p className="error-message" style={{ fontSize: '1.25rem', color: '#333' }}>La página que buscas no existe.</p>
        <button onClick={handleBack} className="back-button" style={{
          marginTop: '2rem',
          padding: '0.8rem 2rem',
          borderRadius: '0.5rem',
          backgroundColor: '#3182ce',
          color: 'white',
          border: 'none',
          cursor: 'pointer'
        }}>
<<<<<<< HEAD
=======
=======
    <div className="error-container">
      <div style={{ backgroundColor: 'rgba(255,255,255,0.1)', padding: '2rem', borderRadius: '1rem' }}>
        <h1 className="error-title">404 🚫</h1>
        <p className="error-message">La página que buscas no existe.</p>
        <button onClick={handleBack} className="back-button" style={{ marginTop: '1rem' }}>
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
          Volver al Dashboard
        </button>
      </div>
    </div>
  );
}

export default Error404;
