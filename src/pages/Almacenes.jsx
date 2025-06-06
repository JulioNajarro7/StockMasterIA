import React, { useEffect, useState } from "react";
import {
  FaSyncAlt,
  FaSearch,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaWarehouse,
  FaUser,
  FaMapMarkerAlt,
  FaBoxes
} from "react-icons/fa";

const API_URL = "https://master.soporteumg.com/api.php?endpoint=almacenes";

function Almacenes() {
  const [almacenes, setAlmacenes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal y formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [almacenActual, setAlmacenActual] = useState({
    nombre: "",
    direccion: "",
    encargado: "",
    capacidad: ""
  });

  useEffect(() => {
    fetchAlmacenes();
  }, []);

  const fetchAlmacenes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al cargar almacenes");
      const data = await response.json();
      setAlmacenes(data);
    } catch (error) {
      setAlmacenes([]);
      setError("No se pudo cargar la lista de almacenes.");
    }
    setLoading(false);
  };

  const limpiarBusqueda = () => setBusqueda("");

  const almacenesFiltrados = almacenes.filter(
    (a) =>
      a.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.direccion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      a.encargado?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalAgregar = () => {
    setAlmacenActual({
      nombre: "",
      direccion: "",
      encargado: "",
      capacidad: ""
    });
    setEditando(false);
    setModalOpen(true);
  };

  const abrirModalEditar = (almacen) => {
    setAlmacenActual({ ...almacen });
    setEditando(true);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setAlmacenActual({
      nombre: "",
      direccion: "",
      encargado: "",
      capacidad: ""
    });
    setEditando(false);
  };

  const handleInput = (e) => {
    setAlmacenActual({ ...almacenActual, [e.target.name]: e.target.value });
  };

  const guardarAlmacen = async (e) => {
    e.preventDefault();
    if (!almacenActual.nombre || !almacenActual.direccion) {
      alert("Completa los campos obligatorios.");
      return;
    }
    try {
      if (editando) {
        await fetch(`${API_URL}&id=${almacenActual.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(almacenActual),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(almacenActual),
        });
      }
      cerrarModal();
      fetchAlmacenes();
    } catch (err) {
      alert("Ocurrió un error.");
    }
  };

  const eliminarAlmacen = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este almacén?")) return;
    try {
      await fetch(`${API_URL}&id=${id}`, { method: "DELETE" });
      fetchAlmacenes();
    } catch (err) {
      alert("No se pudo eliminar.");
    }
  };

  return (
    <div className="card shadow px-0 py-3 py-md-4" style={{ borderRadius: 18 }}>
      {/* Barra de título y búsqueda */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2 px-3 px-md-4">
        <h3 className="mb-0 d-flex align-items-center gap-2" style={{ color: "#23448c" }}>
          <FaWarehouse style={{ fontSize: 28, opacity: 0.9 }} /> Almacenes
        </h3>
        <div className="d-flex gap-2 align-items-center w-100 w-md-auto">
          <div className="input-group rounded shadow-sm flex-grow-1" style={{ minWidth: 120, maxWidth: 280 }}>
            <span className="input-group-text bg-white border-end-0"><FaSearch /></span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar almacén..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
            {busqueda && (
              <button
                className="btn btn-outline-secondary border-start-0"
                type="button"
                onClick={limpiarBusqueda}
                title="Limpiar búsqueda"
              >
                <FaTimesCircle />
              </button>
            )}
          </div>
          <button
            className="btn btn-outline-primary"
            onClick={fetchAlmacenes}
            title="Actualizar lista"
            style={{ fontWeight: "bold" }}
            disabled={loading}
          >
            <FaSyncAlt />
          </button>
          <button
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2"
            onClick={abrirModalAgregar}
            title="Agregar almacén"
            style={{
              fontWeight: "bold",
              borderRadius: 10,
              boxShadow: "0 4px 14px #0084ff14"
            }}
          >
            <FaPlus /> <span className="d-none d-sm-inline">Agregar</span>
          </button>
        </div>
      </div>

      <hr className="my-2 mb-3" />

      {loading ? (
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status"></div>
          <div className="mt-2 text-muted">Cargando almacenes...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center py-3">{error}</div>
      ) : almacenesFiltrados.length === 0 ? (
        <div className="text-center py-4 text-muted">No se encontraron almacenes.</div>
      ) : (
        // --- Tabla para desktop, lista para mobile ---
        <div>
          <div className="d-none d-md-block table-responsive px-2">
            <table className="table table-hover align-middle" style={{ borderRadius: 10, overflow: "hidden" }}>
              <thead className="table-light" style={{ fontSize: 16 }}>
                <tr>
                  <th>#</th>
                  <th><FaWarehouse /> Nombre</th>
                  <th><FaMapMarkerAlt /> Dirección</th>
                  <th><FaUser /> Encargado</th>
                  <th><FaBoxes /> Capacidad</th>
                  <th style={{ width: 120 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {almacenesFiltrados.map((a, idx) => (
                  <tr key={a.id || idx}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{a.nombre}</td>
                    <td className="text-muted">{a.direccion || "-"}</td>
                    <td>{a.encargado || "-"}</td>
                    <td>{a.capacidad || "-"}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => abrirModalEditar(a)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarAlmacen(a.id)}
                        title="Eliminar"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Vista tipo lista para mobile */}
          <div className="d-block d-md-none px-2">
            {almacenesFiltrados.map((a, idx) => (
              <div key={a.id || idx} className="card mb-2 shadow-sm" style={{ borderRadius: 13 }}>
                <div className="card-body py-2 px-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ fontSize: 16 }}>{a.nombre}</span>
                    <span>
                      <button className="btn btn-xs btn-outline-secondary me-1 py-1 px-2"
                        onClick={() => abrirModalEditar(a)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-xs btn-outline-danger py-1 px-2"
                        onClick={() => eliminarAlmacen(a.id)} title="Eliminar">
                        <FaTrash />
                      </button>
                    </span>
                  </div>
                  <div className="text-muted small">{a.direccion || "-"}</div>
                  <div className="d-flex flex-wrap gap-2 mt-1 align-items-center">
                    <span className="badge bg-info text-dark">{a.encargado || "-"}</span>
                    <span className="badge bg-light text-dark">{a.capacidad || "-"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para agregar/editar almacén */}
      {modalOpen && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: "#0008" }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: 15 }}>
              <form onSubmit={guardarAlmacen}>
                <div className="modal-header" style={{ background: "#f3f6fb" }}>
                  <h5 className="modal-title fw-bold">
                    {editando ? "Editar almacén" : "Agregar almacén"}
                  </h5>
                  <button type="button" className="btn-close" onClick={cerrarModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Nombre *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="nombre"
                      value={almacenActual.nombre}
                      onChange={handleInput}
                      required
                      placeholder="Nombre del almacén"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Dirección *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="direccion"
                      value={almacenActual.direccion}
                      onChange={handleInput}
                      required
                      placeholder="Dirección física"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Encargado</label>
                    <input
                      type="text"
                      className="form-control"
                      name="encargado"
                      value={almacenActual.encargado}
                      onChange={handleInput}
                      placeholder="Nombre del encargado"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Capacidad</label>
                    <input
                      type="number"
                      className="form-control"
                      name="capacidad"
                      value={almacenActual.capacidad}
                      onChange={handleInput}
                      min={0}
                      placeholder="Capacidad máxima"
                    />
                  </div>
                </div>
                <div className="modal-footer" style={{ background: "#f6f6f6" }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editando ? "Guardar cambios" : "Agregar almacén"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Almacenes;
