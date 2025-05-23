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

<<<<<<< HEAD
import AiComandos from './pages/AiComandos.jsx';
import Graficas from './pages/Graficas.jsx';
import RecuperarContraseña from './pages/RecuperarContraseña.jsx';
import CrearUsuario from './pages/CrearUsuario.jsx';
import ActivarUsuario from './pages/ActivarUsuario.jsx';
=======
import AiComandos from './pages/AiComandos.jsx'; // 👈 única IA que queda activa
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92

function App() {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
<<<<<<< HEAD
    const remember = localStorage.getItem('rememberMe') === 'true';
    const auth = localStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole');

    if (remember && auth) {
      setIsAuthenticated(true);
      setUserRole(role);
    }

=======
    const localAuth = localStorage.getItem('isAuthenticated') === 'true';
    const sessionAuth = sessionStorage.getItem('isAuthenticated') === 'true';
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (localAuth || sessionAuth) {
      setIsAuthenticated(true);
      setUserRole(role);
    }
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
    setCheckingAuth(false);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
<<<<<<< HEAD
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
    if (!isAuthenticated) return <Navigate to="/" replace />;
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
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
                  <input
                    type="checkbox"
                    id="rememberMe"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
<<<<<<< HEAD
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
=======
                  <label htmlFor="rememberMe">Recordarme esta sesión</label>
                </div>
                <button type="submit">Iniciar sesión</button>
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
              </form>
            </div>
          </div>
        }
      />

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

      <Route path="/recuperar" element={<RecuperarContraseña />} />
      <Route path="/crear" element={<CrearUsuario />} />
      <Route path="/activar" element={<ActivarUsuario />} />

=======

      {/* 👇 Módulo único de IA con comandos */}
      <Route path="/ai-comandos" element={<ProtectedRoute><AiComandos /></ProtectedRoute>} />

      {/* Error */}
>>>>>>> b8fc8abe4d0cadda77f6efc679acffec5103da92
      <Route path="*" element={<Error404 />} />
    </Routes>
  );
}

export default App;
