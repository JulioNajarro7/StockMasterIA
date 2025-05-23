import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoMSX from './assets/LogoMSX.svg';
import './App.css';

import AdminDashboard from './pages/AdminDashboard.jsx';
import TecnicoDashboard from './pages/TecnicoDashboard.jsx';
import OperativoDashboard from './pages/OperativoDashboard.jsx';

import Productos from './pages/Productos.jsx';
import Almacenes from './pages/Almacenes.jsx';
import Pedidos from './pages/Pedidos.jsx';
import Alertas from './pages/Alertas.jsx';
import Entradas from './pages/Entradas.jsx';
import Salidas from './pages/Salidas.jsx';
import Reportes from './pages/Reportes.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Error404 from './pages/Error404.jsx';

import AiComandos from './pages/AiComandos.jsx';
import Graficas from './pages/Graficas.jsx';
import RecuperarContraseña from './pages/RecuperarContraseña.jsx';
import CrearUsuario from './pages/CrearUsuario.jsx';
import ActivarUsuario from './pages/ActivarUsuario.jsx';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const remember = localStorage.getItem('rememberMe') === 'true';
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');

    if (remember && auth) {
      setIsAuthenticated(true);
      setUserRole(role);
    }

    setCheckingAuth(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('https://master.soporteumg.com/api.php?endpoint=usuarios');
      const users = await response.json();

      const userFound = users.find(
        (u) => u.nombre === email && u.password === password
      );

      if (userFound) {
        if (userFound.estado !== 'activo') {
          alert('⚠️ Tu cuenta aún no está activada. Revisa tu correo.');
          return;
        }

        setIsAuthenticated(true);
        setUserRole(userFound.rol);

        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', userFound.rol);
        } else {
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('userRole', userFound.rol);
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userRole');
        }

        if (userFound.rol === 'admin') navigate('/admin');
        else if (userFound.rol === 'tecnico') navigate('/tecnico');
        else if (userFound.rol === 'operativo') navigate('/operativo');
        else navigate('/');
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      console.error('Error al conectar con API:', error);
      alert('Error de servidor');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.clear();
    sessionStorage.clear();
    navigate('/');
  };

  const ProtectedRoute = ({ children }) => {
    if (checkingAuth) return <div className="loading">Cargando...</div>;
    const localAuth = localStorage.getItem('isAuthenticated') === 'true';
    const sessionAuth = sessionStorage.getItem('isAuthenticated') === 'true';

    if (!localAuth && !sessionAuth) return <Navigate to="/" replace />;
    return children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <div className="login-container">
            <div className="login-card">
              <img src={LogoMSX} alt="Logo MasterStockX" className="login-logo" />
              <h1 className="login-title">Usuario</h1>

              <form onSubmit={handleLogin} className="login-form">
                <input
                  type="text"
                  placeholder="Nombre de usuario"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <input
                  type="password"
                  placeholder="Contraseña"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />

                <div className="remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <label htmlFor="rememberMe">Recordar esta sesión</label>
                </div>

                <button type="submit">Iniciar sesión</button>

                <p style={{ marginTop: '1rem', fontSize: '0.9rem' }}>
                  <a href="/recuperar" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
                    ¿Olvidaste tu contraseña?
                  </a>
                </p>
                <p style={{ fontSize: '0.9rem' }}>
                  <a href="/crear" style={{ color: '#4f46e5', textDecoration: 'underline' }}>
                    ¿No tienes cuenta? Crear usuario
                  </a>
                </p>
              </form>
            </div>
          </div>
        }
      />

      <Route path="/admin" element={<ProtectedRoute><AdminDashboard onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="/tecnico" element={<ProtectedRoute><TecnicoDashboard onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="/operativo" element={<ProtectedRoute><OperativoDashboard onLogout={handleLogout} /></ProtectedRoute>} />

      <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
      <Route path="/almacenes" element={<ProtectedRoute><Almacenes /></ProtectedRoute>} />
      <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
      <Route path="/alertas" element={<ProtectedRoute><Alertas /></ProtectedRoute>} />
      <Route path="/entradas" element={<ProtectedRoute><Entradas /></ProtectedRoute>} />
      <Route path="/salidas" element={<ProtectedRoute><Salidas /></ProtectedRoute>} />
      <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
      <Route path="/graficas" element={<ProtectedRoute><Graficas /></ProtectedRoute>} />
      <Route path="/ai-comandos" element={<ProtectedRoute><AiComandos /></ProtectedRoute>} />

      <Route path="/recuperar" element={<RecuperarContraseña />} />
      <Route path="/crear" element={<CrearUsuario />} />
      <Route path="/activar" element={<ActivarUsuario />} />

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
