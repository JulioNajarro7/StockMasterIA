import React, { useEffect, useState } from "react";
import {
  FaSyncAlt,
  FaSearch,
  FaTimesCircle,
  FaPlus,
  FaEdit,
  FaTrash,
  FaBoxes,
  FaTag,
  FaCubes,
  FaDollarSign,
  FaWarehouse
} from "react-icons/fa";

const API_URL = "https://master.soporteumg.com/api.php?endpoint=productos";

function Productos() {
  const [productos, setProductos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Modal y form
  const [modalOpen, setModalOpen] = useState(false);
  const [editando, setEditando] = useState(false);
  const [productoActual, setProductoActual] = useState({
    nombre: "",
    descripcion: "",
    categoria_id: "",
    stock_actual: 0,
    stock_minimo: 0,
    ubicacion: "",
    precio: ""
  });

  useEffect(() => {
    fetchProductos();
  }, []);

  const fetchProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error("Error al cargar productos");
      const data = await response.json();
      setProductos(data);
    } catch (error) {
      setProductos([]);
      setError("No se pudo cargar la lista de productos.");
    }
    setLoading(false);
  };

  const limpiarBusqueda = () => setBusqueda("");

  const productosFiltrados = productos.filter(
    (p) =>
      p.nombre?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.descripcion?.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.ubicacion?.toLowerCase().includes(busqueda.toLowerCase())
  );

  const abrirModalAgregar = () => {
    setProductoActual({
      nombre: "",
      descripcion: "",
      categoria_id: "",
      stock_actual: 0,
      stock_minimo: 0,
      ubicacion: "",
      precio: ""
    });
    setEditando(false);
    setModalOpen(true);
  };

  const abrirModalEditar = (producto) => {
    setProductoActual({ ...producto });
    setEditando(true);
    setModalOpen(true);
  };

  const cerrarModal = () => {
    setModalOpen(false);
    setProductoActual({
      nombre: "",
      descripcion: "",
      categoria_id: "",
      stock_actual: 0,
      stock_minimo: 0,
      ubicacion: "",
      precio: ""
    });
    setEditando(false);
  };

  const handleInput = (e) => {
    setProductoActual({ ...productoActual, [e.target.name]: e.target.value });
  };

  const guardarProducto = async (e) => {
    e.preventDefault();
    if (!productoActual.nombre || !productoActual.categoria_id) {
      alert("Completa los campos obligatorios.");
      return;
    }
    try {
      if (editando) {
        await fetch(`${API_URL}&id=${productoActual.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoActual),
        });
      } else {
        await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productoActual),
        });
      }
      cerrarModal();
      fetchProductos();
    } catch (err) {
      alert("Ocurrió un error.");
    }
  };

  const eliminarProducto = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await fetch(`${API_URL}&id=${id}`, { method: "DELETE" });
      fetchProductos();
    } catch (err) {
      alert("No se pudo eliminar.");
    }
  };

  const badgeStock = (actual, minimo) =>
    Number(actual) < Number(minimo)
      ? <span className="badge bg-danger">{actual} <span className="d-none d-sm-inline">Bajo</span></span>
      : <span className="badge bg-success">{actual}</span>;

  return (
    <div className="card shadow px-0 py-3 py-md-4" style={{ borderRadius: 18 }}>
      {/* Barra de título y búsqueda */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-3 gap-2 px-3 px-md-4">
        <h3 className="mb-0 d-flex align-items-center gap-2" style={{ color: "#23448c" }}>
          <FaBoxes style={{ fontSize: 28, opacity: 0.9 }} /> Productos
        </h3>
        <div className="d-flex gap-2 align-items-center w-100 w-md-auto">
          <div className="input-group rounded shadow-sm flex-grow-1" style={{ minWidth: 120, maxWidth: 280 }}>
            <span className="input-group-text bg-white border-end-0"><FaSearch /></span>
            <input
              type="text"
              className="form-control border-start-0"
              placeholder="Buscar producto..."
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
            onClick={fetchProductos}
            title="Actualizar lista"
            style={{ fontWeight: "bold" }}
            disabled={loading}
          >
            <FaSyncAlt />
          </button>
          <button
            className="btn btn-primary shadow-sm d-flex align-items-center gap-2"
            onClick={abrirModalAgregar}
            title="Agregar producto"
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
          <div className="mt-2 text-muted">Cargando productos...</div>
        </div>
      ) : error ? (
        <div className="alert alert-danger text-center py-3">{error}</div>
      ) : productosFiltrados.length === 0 ? (
        <div className="text-center py-4 text-muted">No se encontraron productos.</div>
      ) : (
        // --- Tabla para desktop, lista para mobile ---
        <div>
          <div className="d-none d-md-block table-responsive px-2">
            <table className="table table-hover align-middle" style={{ borderRadius: 10, overflow: "hidden" }}>
              <thead className="table-light" style={{ fontSize: 16 }}>
                <tr>
                  <th>#</th>
                  <th><FaTag /> Nombre</th>
                  <th><FaCubes /> Descripción</th>
                  <th><FaBoxes /> Categoría</th>
                  <th><FaWarehouse /> Ubicación</th>
                  <th><FaCubes /> Stock actual</th>
                  <th><FaCubes /> Stock mínimo</th>
                  <th><FaDollarSign /> Precio</th>
                  <th style={{ width: 120 }}>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {productosFiltrados.map((p, idx) => (
                  <tr key={p.id || idx}>
                    <td>{idx + 1}</td>
                    <td className="fw-semibold">{p.nombre}</td>
                    <td className="text-muted">{p.descripcion || "-"}</td>
                    <td><span className="badge bg-info text-dark">{p.categoria_id || "-"}</span></td>
                    <td><span className="badge bg-light text-dark">{p.ubicacion || "-"}</span></td>
                    <td>{badgeStock(p.stock_actual, p.stock_minimo)}</td>
                    <td><span className="badge bg-secondary">{p.stock_minimo}</span></td>
                    <td>
                      <span className="badge bg-light text-dark">
                        {p.precio ? "Q " + Number(p.precio).toFixed(2) : "-"}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-sm btn-outline-secondary me-1"
                        onClick={() => abrirModalEditar(p)}
                        title="Editar"
                      >
                        <FaEdit />
                      </button>
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => eliminarProducto(p.id)}
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
            {productosFiltrados.map((p, idx) => (
              <div key={p.id || idx} className="card mb-2 shadow-sm" style={{ borderRadius: 13 }}>
                <div className="card-body py-2 px-2">
                  <div className="d-flex justify-content-between align-items-center">
                    <span className="fw-bold" style={{ fontSize: 16 }}>{p.nombre}</span>
                    <span>
                      <button className="btn btn-xs btn-outline-secondary me-1 py-1 px-2"
                        onClick={() => abrirModalEditar(p)} title="Editar">
                        <FaEdit />
                      </button>
                      <button className="btn btn-xs btn-outline-danger py-1 px-2"
                        onClick={() => eliminarProducto(p.id)} title="Eliminar">
                        <FaTrash />
                      </button>
                    </span>
                  </div>
                  <div className="text-muted small">{p.descripcion || "-"}</div>
                  <div className="d-flex flex-wrap gap-2 mt-1 align-items-center">
                    <span className="badge bg-info text-dark">{p.categoria_id || "-"}</span>
                    <span className="badge bg-light text-dark">{p.ubicacion || "-"}</span>
                    <span>Stock: {badgeStock(p.stock_actual, p.stock_minimo)}</span>
                    <span className="badge bg-secondary">Mín: {p.stock_minimo}</span>
                    <span className="badge bg-light text-dark">
                      {p.precio ? "Q " + Number(p.precio).toFixed(2) : "-"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Modal para agregar/editar producto */}
      {modalOpen && (
        <div className="modal show fade d-block" tabIndex="-1" style={{ background: "#0008" }}>
          <div className="modal-dialog">
            <div className="modal-content" style={{ borderRadius: 15 }}>
              <form onSubmit={guardarProducto}>
                <div className="modal-header" style={{ background: "#f3f6fb" }}>
                  <h5 className="modal-title fw-bold">
                    {editando ? "Editar producto" : "Agregar producto"}
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
                      value={productoActual.nombre}
                      onChange={handleInput}
                      required
                      placeholder="Ej: Detergente Ariel"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Descripción</label>
                    <input
                      type="text"
                      className="form-control"
                      name="descripcion"
                      value={productoActual.descripcion}
                      onChange={handleInput}
                      placeholder="Breve descripción"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Categoría *</label>
                    <input
                      type="text"
                      className="form-control"
                      name="categoria_id"
                      value={productoActual.categoria_id}
                      onChange={handleInput}
                      required
                      placeholder="ID o nombre de la categoría"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Ubicación</label>
                    <input
                      type="text"
                      className="form-control"
                      name="ubicacion"
                      value={productoActual.ubicacion}
                      onChange={handleInput}
                      placeholder="Ubicación del producto"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Stock actual *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock_actual"
                      value={productoActual.stock_actual}
                      onChange={handleInput}
                      required
                      min={0}
                      placeholder="Cantidad en inventario"
                    />
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Stock mínimo *</label>
                    <input
                      type="number"
                      className="form-control"
                      name="stock_minimo"
                      value={productoActual.stock_minimo}
                      onChange={handleInput}
                      required
                      min={0}
                      placeholder="Mínimo permitido"
                    />
                    <small className="text-muted">Al llegar al mínimo, aparecerá una alerta para reponer.</small>
                  </div>
                  <div className="mb-2">
                    <label className="form-label fw-semibold">Precio</label>
                    <input
                      type="number"
                      className="form-control"
                      name="precio"
                      value={productoActual.precio}
                      onChange={handleInput}
                      min={0}
                      step="0.01"
                      placeholder="Precio de venta (opcional)"
                    />
                  </div>
                </div>
                <div className="modal-footer" style={{ background: "#f6f6f6" }}>
                  <button type="button" className="btn btn-outline-secondary" onClick={cerrarModal}>
                    Cancelar
                  </button>
                  <button type="submit" className="btn btn-primary">
                    {editando ? "Guardar cambios" : "Agregar producto"}
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

export default Productos;
