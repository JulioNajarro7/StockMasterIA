import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import fondo from './assets/fondo.gif';
import LogoMSX from './assets/LogoMSX.svg';

import Dashboard from './pages/Dashboard.jsx';
import DashboardHome from './pages/DashboardHome.jsx';

import Productos from './pages/Productos.jsx';
import Almacenes from './pages/Almacenes.jsx';
import Pedidos from './pages/Pedidos.jsx';
import Alertas from './pages/Alertas.jsx';
import AsistenteIA from './pages/AsistenteIA.jsx';
import Movimientos from './pages/Movimientos.jsx';
import Reportes from './pages/Reportes.jsx';
import Usuarios from './pages/Usuarios.jsx';
import RecuperarContraseña from './pages/RecuperarContraseña.jsx';
import CrearUsuario from './pages/CrearUsuario.jsx';
import ActivarUsuario from './pages/ActivarUsuario.jsx';
import Proveedores from './pages/Proveedores.jsx';


import Error404 from './pages/Error404.jsx';

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [usuario, setUsuario] = useState(''); // Cambiado a usuario (login)
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

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
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://master.soporteumg.com/api.php?endpoint=usuarios');
      const users = await response.json();

      // Validación: usuario y contraseña
      const userFound = users.find(
        (u) => u.usuario === usuario && u.password === password
      );

      if (userFound) {
        if (userFound.estado !== 'activo') {
          setError('⚠️ Tu cuenta aún no está activada. Revisa tu correo.');
          setLoading(false);
          return;
        }

        setIsAuthenticated(true);
        setUserRole(userFound.rol);

        // Guardar datos completos del usuario (nombre y usuario)
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', userFound.rol);
          localStorage.setItem('nombreUsuario', userFound.nombre); // nombre real
          localStorage.setItem('usuarioLogin', userFound.usuario); // login
        } else {
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('userRole', userFound.rol);
          sessionStorage.setItem('nombreUsuario', userFound.nombre);
          sessionStorage.setItem('usuarioLogin', userFound.usuario);
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('isAuthenticated');
          localStorage.removeItem('userRole');
          localStorage.removeItem('nombreUsuario');
          localStorage.removeItem('usuarioLogin');
        }

        navigate('/admin');
      } else {
        setError('Usuario o contraseña incorrectos');
      }
    } catch (error) {
      setError('Error de servidor');
    } finally {
      setLoading(false);
      setPassword('');
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
                .remember-me label {
                  margin-left: 6px;
                  color: #333;
                  font-size: 0.97rem;
                }
              `}
            </style>
            <div className="login-card p-4 shadow-lg" style={{ width: 350 }}>
              <div className="text-center mb-3">
                <img src={LogoMSX} alt="Logo MasterStockX" style={{ maxWidth: 90 }} />
              </div>
              <h3 className="card-title mb-3 text-center">Iniciar Sesión</h3>
              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label htmlFor="usuario" className="form-label">
                    Usuario
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="usuario"
                    name="usuario"
                    value={usuario}
                    onChange={(e) => setUsuario(e.target.value)}
                    autoComplete="username"
                    required
                    autoFocus
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Contraseña
                  </label>
                  <input
                    type="password"
                    className="form-control"
                    id="password"
                    name="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                </div>
                <div className="mb-2 d-flex align-items-center remember-me">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    style={{ width: 16, height: 16 }}
                  />
                  <label htmlFor="rememberMe">Recordar esta sesión</label>
                </div>
                {error && (
                  <div className="alert alert-danger py-1 mb-2">{error}</div>
                )}
                <button type="submit" className="btn btn-primary w-100 mt-1" style={{ borderRadius: 8 }} disabled={loading}>
                  {loading ? "Entrando..." : "Entrar"}
                </button>
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

      <Route path="/recuperar" element={<RecuperarContraseña />} />
      <Route path="/crear" element={<CrearUsuario />} />
      <Route path="/activar" element={<ActivarUsuario />} />

      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <Dashboard onLogout={handleLogout} />
          </ProtectedRoute>
        }
      >
        <Route index element={<DashboardHome />} />
        <Route path="productos" element={<Productos />} />
        <Route path="almacenes" element={<Almacenes />} />
        <Route path="pedidos" element={<Pedidos />} />
        <Route path="alertas" element={<Alertas />} />
        <Route path="AsistenteIA" element={<AsistenteIA />} />
        <Route path="Movimientos" element={<Movimientos />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="usuarios" element={<Usuarios />} />
        <Route path="Proveedores" element={<Proveedores />} />
      </Route>

      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
