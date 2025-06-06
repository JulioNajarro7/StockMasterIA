import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FaSyncAlt, FaArrowLeft, FaBoxes, FaExclamationTriangle,
  FaMapMarkerAlt, FaTag, FaCubes
} from 'react-icons/fa';

const API_PRODUCTOS = 'https://master.soporteumg.com/api.php?endpoint=productos';

function Alertas() {
  const [alertas, setAlertas] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Cargar alertas desde productos (stock y ubicación)
  const fetchAlertas = async () => {
    setLoading(true);
    try {
      const res = await fetch(API_PRODUCTOS);
      const data = await res.json();
      // Stock bajo/crítico
      const alertasStock = data
        .filter(p => Number(p.stock_actual) <= Number(p.stock_minimo))
        .map(p => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          categoria: p.categoria_id,
          stock: p.stock_actual,
          minimo: p.stock_minimo,
          ubicacion: p.ubicacion || "",
          tipo: Number(p.stock_actual) <= 3 ? 'Crítico' : 'Bajo',
        }));
      // Sin ubicación
      const alertasUbicacion = data
        .filter(p => !p.ubicacion || p.ubicacion === "")
        .map(p => ({
          id: p.id,
          nombre: p.nombre,
          descripcion: p.descripcion,
          categoria: p.categoria_id,
          stock: p.stock_actual,
          minimo: p.stock_minimo,
          ubicacion: "",
          tipo: 'Sin ubicación',
        }));
      setAlertas([...alertasStock, ...alertasUbicacion]);
    } catch (err) {
      setAlertas([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchAlertas();
    // eslint-disable-next-line
  }, []);

  const goBack = () => {
    const role = localStorage.getItem('userRole') || sessionStorage.getItem('userRole');
    navigate(role === 'admin' ? '/admin' : '/');
  };

  // Badge de alerta
  const badgeTipo = (tipo) =>
    tipo === "Crítico"
      ? <span className="badge bg-danger">🔴 Crítico</span>
      : tipo === "Bajo"
      ? <span className="badge bg-warning text-dark">🟠 Bajo</span>
      : tipo === "Sin ubicación"
      ? <span className="badge bg-info text-dark">📍 Sin ubicación</span>
      : null;

  // Badge de stock
  const badgeStock = (actual, minimo) =>
    Number(actual) < Number(minimo)
      ? <span className="badge bg-danger">{actual}</span>
      : <span className="badge bg-success">{actual}</span>;

  return (
    <div className="card shadow px-0 py-3 py-md-4" style={{ borderRadius: 18 }}>
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2 px-3 px-md-4">
        <h3 className="mb-0 d-flex align-items-center gap-2" style={{ color: "#23448c" }}>
          <FaExclamationTriangle style={{ fontSize: 28, opacity: 0.9 }} /> Alertas de Inventario
        </h3>
        <div className="d-flex gap-2 align-items-center w-100 w-md-auto">
          <button className="btn btn-outline-primary" onClick={fetchAlertas} disabled={loading}>
            <FaSyncAlt />
          </button>
          <button className="btn btn-outline-secondary" onClick={goBack}>
            <FaArrowLeft /> <span className="d-none d-sm-inline">Volver</span>
          </button>
        </div>
      </div>

      <hr className="my-2 mb-3" />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <div className="mt-2 text-muted">Buscando alertas...</div>
        </div>
      ) : alertas.length === 0 ? (
        <div className="text-center py-5 text-muted">
          <FaBoxes style={{ fontSize: 48, opacity: 0.18 }} />
          <div>No hay alertas de inventario.</div>
        </div>
      ) : (
        <div>
          {/* Desktop Table */}
          <div className="d-none d-md-block table-responsive px-2">
            <table className="table table-hover align-middle" style={{ borderRadius: 10, overflow: "hidden" }}>
              <thead className="table-light" style={{ fontSize: 16 }}>
                <tr>
                  <th>#</th>
                  <th><FaTag /> Nombre</th>
                  <th><FaCubes /> Descripción</th>
                  <th><FaBoxes /> Categoría</th>
                  <th>Stock actual</th>
                  <th>Mínimo</th>
                  <th>Ubicación</th>
                  <th>Alerta</th>
                </tr>
              </thead>
              <tbody>
                {alertas.map((a, idx) => (
                  <tr key={a.id + a.tipo + idx}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{a.nombre}</td>
                    <td className="text-muted">{a.descripcion || "-"}</td>
                    <td><span className="badge bg-info text-dark">{a.categoria || "-"}</span></td>
                    <td>{badgeStock(a.stock, a.minimo)}</td>
                    <td><span className="badge bg-secondary">{a.minimo}</span></td>
                    <td>
                      {a.ubicacion ? (
                        <span className="badge bg-success">{a.ubicacion}</span>
                      ) : (
                        <span className="badge bg-info text-dark">No asignada</span>
                      )}
                    </td>
                    <td>{badgeTipo(a.tipo)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Mobile Cards */}
          <div className="d-block d-md-none px-2">
            {alertas.map((a, idx) => (
              <div key={a.id + a.tipo + idx} className="card mb-2 shadow-sm" style={{ borderRadius: 13 }}>
                <div className="card-body py-2 px-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ fontSize: 16 }}>{a.nombre}</span>
                    {badgeTipo(a.tipo)}
                  </div>
                  <div className="small text-muted mb-1">{a.descripcion || "-"}</div>
                  <div className="d-flex flex-wrap gap-2 mt-1 align-items-center">
                    <span className="badge bg-info text-dark">{a.categoria || "-"}</span>
                    <span>Stock: {badgeStock(a.stock, a.minimo)}</span>
                    <span className="badge bg-secondary">Mín: {a.minimo}</span>
                    {a.ubicacion ? (
                      <span className="badge bg-success">{a.ubicacion}</span>
                    ) : (
                      <span className="badge bg-info text-dark">No asignada</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Alertas;
