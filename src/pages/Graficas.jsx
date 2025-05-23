import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line, CartesianGrid, PieChart, Pie, Cell
} from 'recharts';

function Graficas() {
  const [pedidos, setPedidos] = useState([]);
  const [entradas, setEntradas] = useState([]);
  const [salidas, setSalidas] = useState([]);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const navigate = useNavigate();

  const API = 'https://master.soporteumg.com/api.php';

  useEffect(() => {
    fetch(`${API}?endpoint=pedidos`).then(res => res.json()).then(setPedidos);
    fetch(`${API}?endpoint=entradas`).then(res => res.json()).then(setEntradas);
    fetch(`${API}?endpoint=salidas`).then(res => res.json()).then(setSalidas);

    const handleScroll = () => setShowScrollTop(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const formatearFecha = (fechaISO) => {
    const opciones = { day: 'numeric', month: 'short', year: 'numeric' };
    return new Date(fechaISO).toLocaleDateString('es-ES', opciones);
  };

  const agruparPorFecha = (lista) => {
    return Object.entries(
      lista.reduce((acc, item) => {
        const fechaISO = item.fecha?.split(' ')[0];
        if (fechaISO) acc[fechaISO] = (acc[fechaISO] || 0) + parseInt(item.cantidad);
        return acc;
      }, {})
    ).map(([fechaISO, cantidad]) => ({
      fecha: formatearFecha(fechaISO),
      cantidad
    }));
  };

  const pedidosPorEstado = pedidos.reduce((acc, p) => {
    acc[p.estado] = (acc[p.estado] || 0) + 1;
    return acc;
  }, {});

  const dataPedidos = Object.entries(pedidosPorEstado).map(([estado, cantidad]) => ({ estado, cantidad }));
  const dataEntradas = agruparPorFecha(entradas);
  const dataSalidas = agruparPorFecha(salidas);

  const colores = ['#8884d8', '#82ca9d', '#ffc658', '#ff7f50', '#0088FE', '#00C49F', '#FFBB28'];

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  const goBackToDashboard = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    if (role === 'admin') navigate('/admin');
    else if (role === 'tecnico') navigate('/tecnico');
    else if (role === 'operativo') navigate('/operativo');
    else navigate('/');
  };

  return (
    <div
      className="dashboard-container"
      style={{
        background: 'linear-gradient(135deg, #667eea, #764ba2)',
        minHeight: '100vh',
        padding: '2rem'
      }}
    >
      <h1 className="dashboard-title" style={{ marginBottom: '1rem', color: '#000' }}>📊 Panel de Gráficas</h1>

      <button onClick={goBackToDashboard} className="back-button" style={{ alignSelf: 'flex-start' }}>
        ←
      </button>

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '2rem', justifyContent: 'center', marginTop: '1rem' }}>
        {/* Pedidos por estado */}
        <div style={{ flex: '1 1 400px', background: '#fff', borderRadius: '1rem', padding: '1rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ textAlign: 'center', color: '#000' }}>📦 Pedidos por estado</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={dataPedidos}
                dataKey="cantidad"
                nameKey="estado"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={{ fill: '#000' }}
              >
                {dataPedidos.map((_, index) => (
                  <Cell key={index} fill={colores[index % colores.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ color: '#000' }} />
              <Legend wrapperStyle={{ color: '#000' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Entradas por fecha */}
        <div style={{ flex: '1 1 500px', background: '#fff', borderRadius: '1rem', padding: '1rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ textAlign: 'center', color: '#000' }}>📥 Entradas por fecha</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={dataEntradas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip contentStyle={{ color: '#000' }} />
              <Legend wrapperStyle={{ color: '#000' }} />
              <Line type="monotone" dataKey="cantidad" stroke="#82ca9d" name="Entradas" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Salidas por fecha */}
        <div style={{ flex: '1 1 500px', background: '#fff', borderRadius: '1rem', padding: '1rem', boxShadow: '0 0 10px rgba(0,0,0,0.1)' }}>
          <h3 style={{ textAlign: 'center', color: '#000' }}>📤 Salidas por fecha</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={dataSalidas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="fecha" stroke="#000" />
              <YAxis stroke="#000" />
              <Tooltip contentStyle={{ color: '#000' }} />
              <Legend wrapperStyle={{ color: '#000' }} />
              <Bar dataKey="cantidad" fill="#ff7f50" name="Salidas" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {showScrollTop && (
        <button onClick={scrollToTop} className="scroll-top-button">
          ⬆️ Subir
        </button>
      )}
    </div>
  );
}

export default Graficas;
