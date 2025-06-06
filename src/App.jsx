<<<<<<< HEAD
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom'; 
import { useState, useEffect } from 'react';
import fondo from './assets/fondo.gif';
import LogoMSX from './assets/LogoMSX.svg';

import Dashboard from './pages/Dashboard.jsx';
import DashboardHome from './pages/DashboardHome.jsx';
=======
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import LogoMSX from './assets/LogoMSX.svg';
import './App.css';

import AdminDashboard from './pages/AdminDashboard.jsx';
import TecnicoDashboard from './pages/TecnicoDashboard.jsx';
import OperativoDashboard from './pages/OperativoDashboard.jsx';
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f

import Productos from './pages/Productos.jsx';
import Almacenes from './pages/Almacenes.jsx';
import Pedidos from './pages/Pedidos.jsx';
import Alertas from './pages/Alertas.jsx';
<<<<<<< HEAD
import AsistenteIA from './pages/AsistenteIA.jsx';
import Movimientos from './pages/Movimientos.jsx';
import Reportes from './pages/Reportes.jsx';
import Usuarios from './pages/Usuarios.jsx';
import RecuperarContraseña from './pages/RecuperarContraseña.jsx';
import CrearUsuario from './pages/CrearUsuario.jsx';
import ActivarUsuario from './pages/ActivarUsuario.jsx';
import Proveedores from './pages/Proveedores.jsx';


import Error404 from './pages/Error404.jsx';
=======
import Entradas from './pages/Entradas.jsx';
import Salidas from './pages/Salidas.jsx';
import Reportes from './pages/Reportes.jsx';
import Usuarios from './pages/Usuarios.jsx';
import Error404 from './pages/Error404.jsx';

<<<<<<< HEAD
import AiComandos from './pages/AiComandos.jsx';
import Graficas from './pages/Graficas.jsx';
import RecuperarContraseña from './pages/RecuperarContraseña.jsx';
import CrearUsuario from './pages/CrearUsuario.jsx';
import ActivarUsuario from './pages/ActivarUsuario.jsx';
=======
import AiComandos from './pages/AiComandos.jsx'; // 👈 única IA que queda activa
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
<<<<<<< HEAD
  const [usuario, setUsuario] = useState(''); // Cambiado a usuario (login)
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
=======
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
<<<<<<< HEAD
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
    const remember = localStorage.getItem('rememberMe') === 'true';
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');

    if (remember && auth) {
      setIsAuthenticated(true);
      setUserRole(role);
    }

<<<<<<< HEAD
=======
=======
    const localAuth = localStorage.getItem('isAuthenticated') === 'true';
    const sessionAuth = sessionStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (localAuth || sessionAuth) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
    setCheckingAuth(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
<<<<<<< HEAD
    setLoading(true);
    setError('');
    try {
      const response = await fetch('https://master.soporteumg.com/api.php?endpoint=usuarios');
      const users = await response.json();

      // Validación: usuario y contraseña
      const userFound = users.find(
        (u) => u.usuario === usuario && u.password === password
=======
    try {
<<<<<<< HEAD
      const response = await fetch('https://master.soporteumg.com/api.php?endpoint=usuarios');
      const users = await response.json();

      const userFound = users.find(
        (u) => u.nombre === email && u.password === password
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      );

      if (userFound) {
        if (userFound.estado !== 'activo') {
<<<<<<< HEAD
          setError('⚠️ Tu cuenta aún no está activada. Revisa tu correo.');
          setLoading(false);
=======
          alert('⚠️ Tu cuenta aún no está activada. Revisa tu correo.');
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
          return;
        }

        setIsAuthenticated(true);
        setUserRole(userFound.rol);

<<<<<<< HEAD
        // Guardar datos completos del usuario (nombre y usuario)
=======
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', userFound.rol);
<<<<<<< HEAD
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
=======
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
=======
      const response = await fetch('http://localhost/api.php?endpoint=login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: email, password })
      });
      const data = await response.json();

      if (data.success) {
        setIsAuthenticated(true);
        setUserRole(data.user.rol);

        if (rememberMe) {
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userRole', data.user.rol);
        } else {
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('userRole', data.user.rol);
        }

        // Redirección según el rol
        if (data.user.rol === 'admin') navigate('/admin');
        else if (data.user.rol === 'tecnico') navigate('/tecnico');
        else if (data.user.rol === 'operativo') navigate('/operativo');
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
        else navigate('/');
      } else {
        alert('Usuario o contraseña incorrectos');
      }
    } catch (error) {
<<<<<<< HEAD
      console.error('Error al conectar con API:', error);
=======
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
      alert('Error de servidor');
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
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
<<<<<<< HEAD
    const localAuth = localStorage.getItem('isAuthenticated') === 'true';
    const sessionAuth = sessionStorage.getItem('isAuthenticated') === 'true';
    if (!localAuth && !sessionAuth) return <Navigate to="/" replace />;
=======
<<<<<<< HEAD
    const localAuth = localStorage.getItem('isAuthenticated') === 'true';
    const sessionAuth = sessionStorage.getItem('isAuthenticated') === 'true';

    if (!localAuth && !sessionAuth) return <Navigate to="/" replace />;
=======
    if (!isAuthenticated) return <Navigate to="/" replace />;
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
    return children;
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
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
=======
          <div className="login-container">
            <div className="login-card">
              <img src={LogoMSX} alt="Logo MasterStockX" className="login-logo" />
              <h1 className="login-title">Usuario</h1>
<<<<<<< HEAD

=======
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
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
<<<<<<< HEAD

=======
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
                <div className="remember-me">
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
<<<<<<< HEAD
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
=======
                  />
<<<<<<< HEAD
                  <label htmlFor="rememberMe">Recordar esta sesión</label>
                </div>

                <button type="submit">Iniciar sesión</button>

>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
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
<<<<<<< HEAD
=======
=======
                  <label htmlFor="rememberMe">Recordarme esta sesión</label>
                </div>
                <button type="submit">Iniciar sesión</button>
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
              </form>
            </div>
          </div>
        }
      />

<<<<<<< HEAD
=======
<<<<<<< HEAD
=======
      {/* Dashboards */}
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
      <Route path="/admin" element={<ProtectedRoute><AdminDashboard onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="/tecnico" element={<ProtectedRoute><TecnicoDashboard onLogout={handleLogout} /></ProtectedRoute>} />
      <Route path="/operativo" element={<ProtectedRoute><OperativoDashboard onLogout={handleLogout} /></ProtectedRoute>} />

<<<<<<< HEAD
=======
      {/* Módulos funcionales */}
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
      <Route path="/productos" element={<ProtectedRoute><Productos /></ProtectedRoute>} />
      <Route path="/almacenes" element={<ProtectedRoute><Almacenes /></ProtectedRoute>} />
      <Route path="/pedidos" element={<ProtectedRoute><Pedidos /></ProtectedRoute>} />
      <Route path="/alertas" element={<ProtectedRoute><Alertas /></ProtectedRoute>} />
      <Route path="/entradas" element={<ProtectedRoute><Entradas /></ProtectedRoute>} />
      <Route path="/salidas" element={<ProtectedRoute><Salidas /></ProtectedRoute>} />
      <Route path="/reportes" element={<ProtectedRoute><Reportes /></ProtectedRoute>} />
      <Route path="/usuarios" element={<ProtectedRoute><Usuarios /></ProtectedRoute>} />
<<<<<<< HEAD
      <Route path="/graficas" element={<ProtectedRoute><Graficas /></ProtectedRoute>} />
      <Route path="/ai-comandos" element={<ProtectedRoute><AiComandos /></ProtectedRoute>} />

>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      <Route path="/recuperar" element={<RecuperarContraseña />} />
      <Route path="/crear" element={<CrearUsuario />} />
      <Route path="/activar" element={<ActivarUsuario />} />

<<<<<<< HEAD
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

=======
=======

      {/* 👇 Módulo único de IA con comandos */}
      <Route path="/ai-comandos" element={<ProtectedRoute><AiComandos /></ProtectedRoute>} />

      {/* Error */}
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
>>>>>>> 34122937b37a93ffac8b2283d8c2b6a9769b8c9f
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
