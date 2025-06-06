import React, { useEffect, useState } from "react";
import {
  FaSyncAlt,
  FaSearch,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaExchangeAlt,
  FaWarehouse,
  FaUser,
} from "react-icons/fa";

const API_MOV = "https://master.soporteumg.com/api.php?endpoint=movimientos";
const API_PROD = "https://master.soporteumg.com/api.php?endpoint=productos";
const API_ALM = "https://master.soporteumg.com/api.php?endpoint=almacenes";
const API_USU = "https://master.soporteumg.com/api.php?endpoint=usuarios";

function Movimientos() {
  const [movimientos, setMovimientos] = useState([]);
  const [productos, setProductos] = useState([]);
  const [almacenes, setAlmacenes] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal & formulario
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [movActual, setMovActual] = useState({
    producto_id: "",
    cantidad: "",
    tipo: "entrada",
    usuario_id: "",
    almacen_id: "",
    fecha: "",
  });

  // Cargar datos
  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [mRes, pRes, aRes, uRes] = await Promise.all([
        fetch(API_MOV), fetch(API_PROD), fetch(API_ALM), fetch(API_USU)
      ]);
      const [m, p, a, u] = await Promise.all([
        mRes.json(), pRes.json(), aRes.json(), uRes.json()
      ]);
      setMovimientos(m.reverse());
      setProductos(p);
      setAlmacenes(a);
      setUsuarios(u);
    } catch (error) {
      setError("No se pudo cargar la lista de movimientos.");
    }
    setLoading(false);
  };

  const limpiarBusqueda = () => setBusqueda("");

  // Mapas para mostrar nombres en vez de IDs
  const productosMap = Object.fromEntries(productos.map(p => [p.id, p.nombre]));
  const almacenesMap = Object.fromEntries(almacenes.map(a => [a.id, a.nombre]));
  const usuariosMap = Object.fromEntries(usuarios.map(u => [u.id, u.nombre]));

  // Búsqueda
  const movFiltrados = movimientos.filter((m) =>
    (productosMap[m.producto_id] || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (almacenesMap[m.almacen_id] || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (usuariosMap[m.usuario_id] || "").toLowerCase().includes(busqueda.toLowerCase()) ||
    (m.tipo || "").toLowerCase().includes(busqueda.toLowerCase())
  );

  // MODALES
  const abrirModalAgregar = () => {
    setMovActual({
      producto_id: "",
      cantidad: "",
      tipo: "entrada",
      usuario_id: "",
      almacen_id: "",
      fecha: "",
    });
    setEditando(false);
    setModalOpen(true);
  };

  const abrirModalEditar = (mov) => {
    setMovActual({ ...mov });
    setEditando(true);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setMovActual({
      producto_id: "",
      cantidad: "",
      tipo: "entrada",
      usuario_id: "",
      almacen_id: "",
      fecha: "",
    });
    setEditando(false);
  };

  const handleInput = (e) => {
    setMovActual({ ...movActual, [e.target.name]: e.target.value });
  };

  // AGREGAR o EDITAR
  const guardarMovimiento = async (e) => {
    e.preventDefault();
    if (!movActual.producto_id || !movActual.cantidad || !movActual.tipo || !movActual.usuario_id || !movActual.almacen_id) {
      alert("Completa todos los campos.");
      return;
    }
    try {
      if (editando) {
        await fetch(`${API_MOV}&id=${movActual.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movActual),
        });
      } else {
        await fetch(API_MOV, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(movActual),
        });
      }
      cerrarModal();
      fetchAll();
    } catch (err) {
      alert("Ocurrió un error.");
    }
  };

  // ELIMINAR
  const eliminarMovimiento = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este movimiento?")) return;
    try {
      await fetch(`${API_MOV}&id=${id}`, { method: "DELETE" });
      fetchAll();
    } catch (err) {
      alert("No se pudo eliminar.");
    }
  };

  // Badge por tipo
  const badgeTipo = (tipo) =>
    tipo === "entrada"
      ? <span className="badge bg-success">Entrada</span>
      : <span className="badge bg-danger">Salida</span>;

  return (
    <div className="card shadow px-0 py-3 py-md-4" style={{ borderRadius: 18 }}>
      {/* Barra superior y buscador */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2 px-3 px-md-4">
        <h3 className="mb-0 d-flex align-items-center gap-2" style={{ color: "#23448c" }}>
          <FaExchangeAlt style={{ fontSize: 28, opacity: 0.9 }} /> Movimientos
        </h3>
        <div className="d-flex gap-2 align-items-center w-100 w-md-auto">
          <div className="input-group rounded shadow-sm flex-grow-1" style={{ minWidth: 120, maxWidth: 280 }}>
            <span className="input-group-text bg-white border-end-0"><FaSearch /></span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar movimiento..."
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
            onClick={fetchAll}
            title="Actualizar lista"
            style={{ fontWeight: "bold" }}
            disabled={loading}
          >
            <FaSyncAlt />
          </button>
          <button
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2"
            onClick={abrirModalAgregar}
            title="Agregar movimiento"
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
          <div className="mt-2 text-muted">Cargando movimientos...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center py-3">{error}</div>
      ) : movFiltrados.length === 0 ? (
        <div className="text-center py-4 text-muted">No se encontraron movimientos.</div>
      ) : (
        <div>
          <div className="d-none d-md-block table-responsive px-2">
            <table className="table table-hover align-middle" style={{ borderRadius: 10, overflow: "hidden" }}>
              <thead className="table-light" style={{ fontSize: 16 }}>
                <tr>
                  <th>#</th>
                  <th>Producto</th>
                  <th>Almacén</th>
                  <th>Cantidad</th>
                  <th>Tipo</th>
                  <th>Usuario</th>
                  <th>Fecha</th>
                  <th style={{ width: 120 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {movFiltrados.map((m, idx) => (
                  <tr key={m.id || idx}>
                    <td>{idx + 1}</td>
                    <td>{productosMap[m.producto_id] || m.producto_id}</td>
                    <td>{almacenesMap[m.almacen_id] || m.almacen_id}</td>
                    <td>{m.cantidad}</td>
                    <td>{badgeTipo(m.tipo)}</td>
                    <td>{usuariosMap[m.usuario_id] || m.usuario_id}</td>
                    <td>{m.fecha?.split(" ")[0]}</td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => abrirModalEditar(m)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarMovimiento(m.id)}
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
            {movFiltrados.map((m, idx) => (
              <div key={m.id || idx} className="card mb-2 shadow-sm" style={{ borderRadius: 13 }}>
                <div className="card-body py-2 px-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ fontSize: 16 }}>
                      {productosMap[m.producto_id] || m.producto_id}
                    </span>
                    <span>
                      <button className="btn btn-xs btn-outline-secondary me-1 py-1 px-2"
                        onClick={() => abrirModalEditar(m)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-xs btn-outline-danger py-1 px-2"
                        onClick={() => eliminarMovimiento(m.id)} title="Eliminar">
                        <FaTrash />
                      </button>
                    </span>
                  </div>
                  <div className="small text-muted">Almacén: {almacenesMap[m.almacen_id] || m.almacen_id}</div>
                  <div className="small text-muted">Cantidad: {m.cantidad}</div>
                  <div className="small text-muted">Tipo: {badgeTipo(m.tipo)}</div>
                  <div className="small text-muted">Usuario: {usuariosMap[m.usuario_id] || m.usuario_id}</div>
                  <div className="small text-muted">Fecha: {m.fecha?.split(" ")[0]}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para agregar/editar movimiento */}
      {modalOpen && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: "#0008" }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: 15 }}>
              <form onSubmit={guardarMovimiento}>
                <div className="modal-header" style={{ background: "#f3f6fb" }}>
                  <h5 className="modal-title fw-bold">
                    {editando ? "Editar movimiento" : "Agregar movimiento"}
                  </h5>
                  <button type="button" className="btn-close" onClick={cerrarModal}></button>
                </div>
                <div className="modal-body">
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Producto *</label>
                    <select
                      className="form-select"
                      name="producto_id"
                      value={movActual.producto_id}
                      onChange={handleInput}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {productos.map((p) => (
                        <option value={p.id} key={p.id}>{p.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Cantidad *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="cantidad"
                      value={movActual.cantidad}
                      onChange={handleInput}
                      required
                      min={1}
                      placeholder="Cantidad"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Tipo *</label>
                    <select
                      className="form-select"
                      name="tipo"
                      value={movActual.tipo}
                      onChange={handleInput}
                      required
                    >
                      <option value="entrada">Entrada</option>
                      <option value="salida">Salida</option>
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Usuario *</label>
                    <select
                      className="form-select"
                      name="usuario_id"
                      value={movActual.usuario_id}
                      onChange={handleInput}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {usuarios.map((u) => (
                        <option value={u.id} key={u.id}>{u.nombre}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Almacén *</label>
                    <select
                      className="form-select"
                      name="almacen_id"
                      value={movActual.almacen_id}
                      onChange={handleInput}
                      required
                    >
                      <option value="">Seleccione...</option>
                      {almacenes.map((a) => (
                        <option value={a.id} key={a.id}>{a.nombre}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="modal-footer" style={{ background: "#f6f6f6" }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editando ? "Guardar cambios" : "Agregar movimiento"}
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

export default Movimientos;
